import clickhouse from '@/lib/clickhouse';
import { CLICKHOUSE, PRISMA, runQuery } from '@/lib/db';
import prisma from '@/lib/prisma';
import type { QueryFilters } from '@/lib/types';

const FUNCTION_NAME = 'getReplayTransportCandidates';

export function getReplayTransportCandidates(
  ...args: [websiteId: string, filters: QueryFilters, sessionId?: string]
) {
  return runQuery({
    [PRISMA]: () => relationalQuery(...args),
    [CLICKHOUSE]: () => clickhouseQuery(...args),
  });
}

async function relationalQuery(websiteId: string, filters: QueryFilters, sessionId?: string) {
  const { pagedRawQuery } = prisma;
  const { search } = filters;
  const searchQuery = search
    ? `and (
          session.distinct_id ilike {{search}}
          or session.city ilike {{search}}
          or session.browser ilike {{search}}
          or session.os ilike {{search}}
          or session.device ilike {{search}}
          or sr.visit_id::text ilike {{search}}
        )`
    : '';
  const sessionFilter = sessionId ? 'and sr.session_id = {{sessionId::uuid}}' : '';
  const queryParams = {
    ...filters,
    websiteId,
    sessionId,
    search: search ? `%${search}%` : undefined,
  };

  return pagedRawQuery(
    `
    select
      sr.visit_id as "id",
      sr.visit_id as "visitId",
      sr.visit_id as "replayId",
      sr.session_id as "sessionId",
      sr.website_id as "websiteId",
      session.browser,
      session.os,
      session.device,
      session.country,
      session.city,
      sum(sr.event_count) as "eventCount",
      count(sr.replay_id) as "chunkCount",
      min(sr.started_at) as "startedAt",
      max(sr.ended_at) as "endedAt",
      sum(extract(epoch from sr.ended_at - sr.started_at) * 1000)::bigint as "duration",
      max(sr.created_at) as "createdAt"
    from session_replay sr
    left join session on session.session_id = sr.session_id
      and session.website_id = sr.website_id
    where sr.website_id = {{websiteId::uuid}}
      and sr.created_at between {{startDate}} and {{endDate}}
      ${sessionFilter}
      ${searchQuery}
    group by sr.visit_id,
      sr.session_id,
      sr.website_id,
      session.browser,
      session.os,
      session.device,
      session.country,
      session.city
    order by max(sr.created_at) desc
    `,
    queryParams,
    filters,
    FUNCTION_NAME,
  );
}

async function clickhouseQuery(websiteId: string, filters: QueryFilters, sessionId?: string) {
  const { pagedRawQuery } = clickhouse;
  const { search } = filters;
  const searchQuery = search
    ? `and (
          positionCaseInsensitive(ifNull(website_event.city, ''), {search:String}) > 0
          or positionCaseInsensitive(ifNull(website_event.browser, ''), {search:String}) > 0
          or positionCaseInsensitive(ifNull(website_event.os, ''), {search:String}) > 0
          or positionCaseInsensitive(ifNull(website_event.device, ''), {search:String}) > 0
          or positionCaseInsensitive(toString(session_replay.visit_id), {search:String}) > 0
        )`
    : '';
  const sessionFilter = sessionId ? 'and session_replay.session_id = {sessionId:UUID}' : '';
  const queryParams = {
    ...filters,
    websiteId,
    sessionId,
  };

  return pagedRawQuery(
    `
    select
      session_replay.visit_id as id,
      session_replay.visit_id as visitId,
      session_replay.visit_id as replayId,
      session_replay.session_id as sessionId,
      session_replay.website_id as websiteId,
      any(website_event.browser) as browser,
      any(website_event.os) as os,
      any(website_event.device) as device,
      any(website_event.country) as country,
      any(website_event.city) as city,
      sum(session_replay.event_count) as eventCount,
      count(session_replay.replay_id) as chunkCount,
      min(session_replay.started_at) as startedAt,
      max(session_replay.ended_at) as endedAt,
      toInt64(sum(dateDiff('millisecond', session_replay.started_at, session_replay.ended_at))) as duration,
      max(session_replay.created_at) as createdAt
    from session_replay
    left join (
      select distinct website_id, session_id, visit_id, browser, os, device, country, city
      from website_event
      where website_id = {websiteId:UUID}
        and created_at between {startDate:DateTime64} and {endDate:DateTime64}
    ) website_event
    on website_event.session_id = session_replay.session_id
      and website_event.website_id = session_replay.website_id
      and website_event.visit_id = session_replay.visit_id
    where session_replay.website_id = {websiteId:UUID}
      and session_replay.created_at between {startDate:DateTime64} and {endDate:DateTime64}
      ${sessionFilter}
      ${searchQuery}
    group by session_replay.visit_id, session_replay.session_id, session_replay.website_id
    order by max(session_replay.created_at) desc
    `,
    queryParams,
    filters,
    FUNCTION_NAME,
  );
}
