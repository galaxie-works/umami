import { useState } from 'react';
import { useMessages, useNavigation, useTeamMembersQuery } from '@/components/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TeamMembersTable } from './TeamMembersTable';

export function TeamMembersDataTable({
  teamId,
  allowEdit = false,
}: {
  teamId: string;
  allowEdit?: boolean;
}) {
  const queryResult = useTeamMembersQuery(teamId);
  const { t, labels } = useMessages();
  const { router, updateParams, query } = useNavigation();
  const [search, setSearch] = useState(query?.search || queryResult.data?.search || '');
  const data = queryResult.data;
  const showPager = data && data.count > data.pageSize;

  const handleSearch = (value: string) => {
    setSearch(value);
    router.push(updateParams({ page: 1, search: value }));
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        className="max-w-xs"
        onChange={event => handleSearch(event.currentTarget.value)}
        placeholder={t(labels.search)}
        value={search}
      />
      {queryResult.isLoading ? (
        <div className="h-32 rounded-lg border border-border bg-muted/30" />
      ) : queryResult.error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {String(queryResult.error)}
        </div>
      ) : (
        <>
          <TeamMembersTable data={data?.data || []} teamId={teamId} allowEdit={allowEdit} />
          {showPager && (
            <div className="flex items-center justify-end gap-2">
              <Button
                disabled={data.page <= 1}
                onClick={() => router.push(updateParams({ page: data.page - 1, search }))}
                type="button"
                variant="outline"
              >
                Previous
              </Button>
              <Button
                disabled={data.page * data.pageSize >= data.count}
                onClick={() => router.push(updateParams({ page: data.page + 1, search }))}
                type="button"
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
