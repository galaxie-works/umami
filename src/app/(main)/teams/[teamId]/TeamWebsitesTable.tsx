import { DataColumn, DataTable } from '@umami/react-zen';
import Link from '@/components/common/Link';
import { useMessages } from '@/components/hooks';

export function TeamWebsitesTable({
  teamId,
  data = [],
  allowEdit,
}: {
  teamId: string;
  data: any[];
  allowEdit: boolean;
}) {
  const { t, labels } = useMessages();

  return (
    <DataTable data={data}>
      <DataColumn id="name" label={t(labels.name)}>
        {(row: any) => <Link href={`/teams/${teamId}/websites/${row.id}`}>{row.name}</Link>}
      </DataColumn>
      <DataColumn id="domain" label={t(labels.domain)} />
      <DataColumn id="createdBy" label={t(labels.createdBy)}>
        {(row: any) => row?.createUser?.username}
      </DataColumn>
      {allowEdit && <DataColumn id="permission" label="Access">{() => 'Team website'}</DataColumn>}
    </DataTable>
  );
}
