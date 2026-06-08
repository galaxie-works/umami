import Link from '@/components/common/Link';
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
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t(labels.name)}</TableHead>
            <TableHead>{t(labels.domain)}</TableHead>
            <TableHead>{t(labels.createdBy)}</TableHead>
            {allowEdit && <TableHead>Access</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                className="h-24 text-center text-muted-foreground"
                colSpan={allowEdit ? 4 : 3}
              >
                No team websites found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((row: any) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">
                  <Link href={`/teams/${teamId}/websites/${row.id}`}>{row.name}</Link>
                </TableCell>
                <TableCell>{row.domain}</TableCell>
                <TableCell>{row?.createUser?.username}</TableCell>
                {allowEdit && (
                  <TableCell>
                    <Badge variant="outline">Team website</Badge>
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
