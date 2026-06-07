import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const files = {
  candidatesRoute: 'src/app/api/websites/[websiteId]/replay-transport/candidates/route.ts',
  detailRoute: 'src/app/api/websites/[websiteId]/replay-transport/[visitId]/route.ts',
  query: 'src/queries/sql/replays/getReplayTransportCandidates.ts',
  index: 'src/queries/sql/index.ts',
};

const source = Object.fromEntries(
  Object.entries(files).map(([key, file]) => [key, readFileSync(file, 'utf8')]),
);

assert.match(source.candidatesRoute, /canViewWebsite\(auth, websiteId\)/);
assert.match(source.detailRoute, /canViewWebsite\(auth, websiteId\)/);
assert.ok(files.candidatesRoute.includes('replay-transport/candidates'));
assert.ok(files.detailRoute.includes('replay-transport/[visitId]'));
assert.match(source.detailRoute, /visitId/);
assert.match(source.query, /session_replay/);
assert.match(source.query, /visit_id as "visitId"|visit_id as visitId/);
assert.match(source.query, /left join session|left join \(/);
assert.match(source.index, /getReplayTransportCandidates/);

for (const route of [source.candidatesRoute, source.detailRoute]) {
  assert.doesNotMatch(route, /console\.(log|error|warn|info)/);
  assert.match(route, /status/);
  assert.match(route, /reason/);
}

assert.doesNotMatch(source.candidatesRoute, /\bevents\b\s*:/);
assert.match(source.candidatesRoute, /rows\.length \? 'available' : 'empty'/);
assert.match(source.candidatesRoute, /source_error/);
assert.match(source.candidatesRoute, /no_replay_chunks/);
assert.match(source.detailRoute, /\bevents\b/);
assert.match(source.detailRoute, /playerPayloadStatus/);
assert.match(source.detailRoute, /session_mismatch/);
assert.match(source.detailRoute, /no_replay_chunks/);
assert.match(source.detailRoute, /invalid_request/);
assert.match(source.detailRoute, /source_error/);

console.log('Replay transport contract validator passed');
