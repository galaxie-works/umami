'use client';

import { useLoginQuery } from '@/components/hooks/queries/useLoginQuery';
import { useTeamMembersQuery } from '@/components/hooks/queries/useTeamMembersQuery';
import { useMessages } from '@/components/hooks/useMessages';
import { useNavigation } from '@/components/hooks/useNavigation';
import { Globe } from '@/components/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { ROLES } from '@/lib/constants';
import { WebsiteAddButton } from './WebsiteAddButton';
import { WebsitesDataTable } from './WebsitesDataTable';
import styles from './WebsitesPage.module.css';

export function WebsitesPage() {
  const { user } = useLoginQuery();
  const { teamId } = useNavigation();
  const { t, labels } = useMessages();
  const { data } = useTeamMembersQuery(teamId);

  const showActions =
    (teamId &&
      data?.data.filter(team => team.userId === user.id && team.role !== ROLES.teamViewOnly)
        .length > 0) ||
    (!teamId && user.role !== ROLES.viewOnly);

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.titleIcon}>
            <Globe aria-hidden="true" />
          </span>
          <div>
            <h1>{t(labels.websites)}</h1>
            <p>{t(labels.websites)}</p>
          </div>
        </div>
        {showActions ? <WebsiteAddButton teamId={teamId} /> : null}
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>{t(labels.websites)}</CardTitle>
            <CardDescription>{t(labels.search)}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <WebsitesDataTable teamId={teamId} showActions={showActions} />
        </CardContent>
      </Card>
    </main>
  );
}
