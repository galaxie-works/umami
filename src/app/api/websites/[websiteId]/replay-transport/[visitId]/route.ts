import { z } from 'zod';
import { parseRequest } from '@/lib/request';
import { badRequest, json, unauthorized } from '@/lib/response';
import { canViewWebsite } from '@/permissions';
import { getReplayChunks } from '@/queries/sql';

const querySchema = z.object({
  sessionId: z.uuid().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ websiteId: string; visitId: string }> },
) {
  const { auth, query, error } = await parseRequest(request, querySchema);

  if (error) {
    return error();
  }

  const { websiteId, visitId } = await params;

  if (!z.uuid().safeParse(visitId).success) {
    return badRequest({
      reason: 'invalid_request',
      message: 'Invalid visitId.',
    });
  }

  if (!(await canViewWebsite(auth, websiteId))) {
    return unauthorized();
  }

  try {
    const chunks = await getReplayChunks(websiteId, visitId);

    if (!chunks.length) {
      return json(unavailableDetail(visitId, query.sessionId, 'no_replay_chunks'));
    }

    const chunkSessionId = chunks[0]?.sessionId;

    if (query.sessionId && chunkSessionId !== query.sessionId) {
      return json(unavailableDetail(visitId, query.sessionId, 'session_mismatch'));
    }

    const events = chunks
      .flatMap(chunk => chunk.events)
      .sort((a, b) => Number(a?.timestamp || 0) - Number(b?.timestamp || 0));
    const eventCount =
      events.length || chunks.reduce((sum, chunk) => sum + Number(chunk.eventCount || 0), 0);
    const startedAt = chunks[0]?.startedAt;
    const endedAt = chunks[chunks.length - 1]?.endedAt;

    return json({
      ok: true,
      status: 'available',
      reason: undefined,
      playerPayloadStatus: 'available',
      metadata: {
        id: visitId,
        visitId,
        replayId: visitId,
        sessionId: chunkSessionId,
        eventCount,
        chunkCount: chunks.length,
        startedAt,
        endedAt,
      },
      chunks: chunks.map(chunk => ({
        chunkIndex: chunk.chunkIndex,
        eventCount: chunk.eventCount,
        startedAt: chunk.startedAt,
        endedAt: chunk.endedAt,
      })),
      events,
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

function unavailableDetail(visitId: string, sessionId: string | undefined, reason: string) {
  return {
    ok: true,
    status: 'unavailable',
    reason,
    playerPayloadStatus: 'unavailable',
    metadata: {
      id: visitId,
      visitId,
      replayId: visitId,
      sessionId,
      eventCount: 0,
      chunkCount: 0,
    },
    chunks: [],
    events: [],
  };
}
