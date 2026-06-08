import { useMessages } from '@/components/hooks';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ROLES } from '@/lib/constants';
import { TeamMemberEditButton } from './TeamMemberEditButton';
import { TeamMemberRemoveButton } from './TeamMemberRemoveButton';

export function TeamMembersTable({
  data = [],
  teamId,
  allowEdit = false,
}: {
  data: any[];
  teamId: string;
  allowEdit: boolean;
}) {
  const { t, labels } = useMessages();

  const roles = {
    [ROLES.teamOwner]: t(labels.teamOwner),
    [ROLES.teamManager]: t(labels.teamManager),
    [ROLES.teamMember]: t(labels.teamMember),
    [ROLES.teamViewOnly]: t(labels.viewOnly),
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t(labels.username)}</TableHead>
            <TableHead>{t(labels.role)}</TableHead>
            <TableHead>Website access</TableHead>
            {allowEdit && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                className="h-24 text-center text-muted-foreground"
                colSpan={allowEdit ? 4 : 3}
              >
                No team members found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((row: any) => (
              <TableRow key={row?.id || row?.user?.id}>
                <TableCell className="font-medium">{row?.user?.username}</TableCell>
                <TableCell>{roles[row?.role]}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {Array.isArray(row?.websiteIds) && row.websiteIds.length > 0
                      ? `${row.websiteIds.length} selected`
                      : 'All websites'}
                  </Badge>
                </TableCell>
                {allowEdit && (
                  <TableCell className="text-right">
                    {row?.role !== ROLES.teamOwner && (
                      <div className="flex justify-end gap-1">
                        <TeamMemberEditButton
                          teamId={teamId}
                          userId={row?.user?.id}
                          role={row?.role}
                        />
                        <TeamMemberRemoveButton
                          teamId={teamId}
                          userId={row?.user?.id}
                          userName={row?.user?.username}
                        />
                      </div>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
