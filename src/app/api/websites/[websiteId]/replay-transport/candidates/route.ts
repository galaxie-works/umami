import { z } from 'zod';
import { parseRequest, setWebsiteDate } from '@/lib/request';
import { badRequest, json, unauthorized } from '@/lib/response';
import { pagingParams, searchParams, timezoneParam, unitParam } from '@/lib/schema';
import { canViewWebsite } from '@/permissions';
import { getReplayTransportCandidates } from '@/queries/sql';

const schema = z
  .object({
    startAt: z.coerce.number().optional(),
    endAt: z.coerce.number().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    timezone: timezoneParam.optional(),
    unit: unitParam.optional(),
    sessionId: z.uuid().optional(),
    ...pagingParams,
    ...searchParams,
  })
  .superRefine((data, ctx) => {
    const hasTimestamps = data.startAt != null && data.endAt != null;
    const hasDates = data.startDate != null && data.endDate != null;

    if (!hasTimestamps && !hasDates) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Either startAt+endAt or startDate+endDate must be provided',
      });
    }
  });

export async function GET(
  request: Request,
  { params }: { params: Promise<{ websiteId: string }> },
) {
  const { auth, query, error } = await parseRequest(request, schema);

  if (error) {
    return error();
  }

  const { websiteId } = await params;

  if (!(await canViewWebsite(auth, websiteId))) {
    return unauthorized();
  }

  const filters = await replayTransportFilters(query, websiteId);

  if (!filters.startDate || !filters.endDate) {
    return badRequest({ message: 'Invalid date range.' });
  }

  try {
    const result = await getReplayTransportCandidates(websiteId, filters, query.sessionId);
    const rows = Array.isArray(result?.data) ? result.data : [];
    const count = Number(result?.count ?? rows.length);
    const status = rows.length ? 'available' : 'empty';

    return json({
      ok: true,
      status,
      reason: rows.length ? undefined : 'no_replay_chunks',
      rows,
      summary: {
        replays: count,
        selectableRows: rows.length,
        eventCount: rows.reduce((sum, row) => sum + Number(row.eventCount || 0), 0),
        chunkCount: rows.reduce((sum, row) => sum + Number(row.chunkCount || 0), 0),
      },
      pagination: {
        count,
        page: Number(result?.page ?? filters.page ?? 1),
        pageSize: Number(result?.pageSize ?? filters.pageSize ?? 20),
      },
    });
  } catch {
    return Response.json(
      {
        ok: false,
        status: 'error',
        reason: 'source_error',
        message: 'Replay transport source error.',
      },
      {
        status: 500,
      },
    );
  }
}

async function replayTransportFilters(query: Record<string, any>, websiteId: string) {
  const startDate = query.startAt != null ? new Date(Number(query.startAt)) : query.startDate;
  const endDate = query.endAt != null ? new Date(Number(query.endAt)) : query.endDate;
  const filters = {
    startDate,
    endDate,
    timezone: query.timezone,
    unit: query.unit,
    page: query.page,
    pageSize: query.pageSize,
    search: query.search,
  };

  return setWebsiteDate(websiteId, filters);
}
