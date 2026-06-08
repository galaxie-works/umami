import { TeamLeaveButton } from '@/app/(main)/teams/TeamLeaveButton';
import { useLoginQuery, useMessages, useNavigation, useTeam } from '@/components/hooks';
import { Users } from '@/components/icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROLES } from '@/lib/constants';
import { TeamsMemberAddButton } from '../TeamsMemberAddButton';
import { TeamEditForm } from './TeamEditForm';
import { TeamInvitePanel } from './TeamInvitePanel';
import { TeamManage } from './TeamManage';
import { TeamMembersDataTable } from './TeamMembersDataTable';
import { TeamWebsitesDataTable } from './TeamWebsitesDataTable';

export function TeamSettings({ teamId }: { teamId: string }) {
  const team: any = useTeam();
  const { user } = useLoginQuery();
  const { pathname } = useNavigation();
  const { t, labels } = useMessages();

  const isAdmin = pathname.includes('/admin');
  const currentTeamMember = team?.members?.find((member: any) => member.userId === user.id);

  const isTeamOwner =
    !!team?.members?.find(({ userId, role }) => role === ROLES.teamOwner && userId === user.id) &&
    user.role !== ROLES.viewOnly;

  const canEdit =
    user.isAdmin ||
    (!!currentTeamMember &&
      (currentTeamMember.role === ROLES.teamOwner ||
        currentTeamMember.role === ROLES.teamManager) &&
      !hasSelectedWebsiteScope(currentTeamMember) &&
      user.role !== ROLES.viewOnly);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <Users className="size-5 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{team?.name}</h1>
            <p className="text-sm text-muted-foreground">{t(labels.settings)}</p>
          </div>
        </div>
        {!isTeamOwner && !isAdmin && <TeamLeaveButton teamId={team.id} teamName={team.name} />}
      </div>

      <Card>
        <CardContent className="pt-6">
          <TeamEditForm teamId={teamId} allowEdit={canEdit} showAccessCode={canEdit} />
        </CardContent>
      </Card>

      {canEdit && <TeamInvitePanel teamId={teamId} />}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>{t(labels.members)}</CardTitle>
          {isAdmin && <TeamsMemberAddButton teamId={teamId} />}
        </CardHeader>
        <CardContent>
          <TeamMembersDataTable teamId={teamId} allowEdit={canEdit} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t(labels.websites)}</CardTitle>
        </CardHeader>
        <CardContent>
          <TeamWebsitesDataTable teamId={teamId} allowEdit={canEdit} />
        </CardContent>
      </Card>

      {isTeamOwner && (
        <Card>
          <CardContent className="pt-6">
            <TeamManage teamId={teamId} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function hasSelectedWebsiteScope(member: any) {
  return Array.isArray(member?.websiteIds) && member.websiteIds.length > 0;
}
