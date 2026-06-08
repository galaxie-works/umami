'use client';

import { Ban, MailCheck, RefreshCw, Send } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { useToast } from '@umami/react-zen';
import { useApi, useModified, useMessages } from '@/components/hooks';
import {
  SettingsBadge,
  SettingsButton,
  SettingsCard,
  SettingsField,
  SettingsInput,
  SettingsSelect,
  settingsKitStyles,
} from '@/components/shadcn/SettingsKit';
import { ROLES } from '@/lib/constants';

const teamRoleOptions = [ROLES.teamManager, ROLES.teamMember, ROLES.teamViewOnly];

export function TeamInvitePanel({ teamId }: { teamId: string }) {
  const { get, post, useMutation, useQuery } = useApi();
  const { toast } = useToast();
  const { touch } = useModified();
  const { t, labels } = useMessages();
  const [email, setEmail] = useState('');
  const [teamRole, setTeamRole] = useState<string>(ROLES.teamMember);
  const [websiteScope, setWebsiteScope] = useState('all');
  const [selectedWebsiteIds, setSelectedWebsiteIds] = useState<string[]>([]);

  const websitesQuery = useQuery({
    queryKey: ['team:invite-websites', teamId],
    queryFn: () => get(`/teams/${teamId}/websites`, { pageSize: 100 }),
  });

  const invitationsQuery = useQuery({
    queryKey: ['team:invitations', teamId],
    queryFn: () => get('/admin/invitations', { pageSize: 50, teamId }),
  });

  const createInvitation = useMutation({
    mutationFn: (data: Record<string, any>) => post('/admin/invitations', data),
    onSuccess: () => {
      setEmail('');
      setWebsiteScope('all');
      setSelectedWebsiteIds([]);
      toast('Team invitation queued.');
      touch('team:users');
      invitationsQuery.refetch();
    },
  });

  const resendInvitation = useMutation({
    mutationFn: (invitationId: string) => post(`/admin/invitations/${invitationId}/resend`),
    onSuccess: () => {
      toast('Invitation resent.');
      invitationsQuery.refetch();
    },
  });

  const revokeInvitation = useMutation({
    mutationFn: (invitationId: string) => post(`/admin/invitations/${invitationId}/revoke`),
    onSuccess: () => {
      toast('Invitation revoked.');
      invitationsQuery.refetch();
    },
  });

  const pendingInvitations = useMemo(
    () =>
      (invitationsQuery.data?.data || []).filter((invite: any) => invite.status !== 'accepted'),
    [invitationsQuery.data?.data, teamId],
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    createInvitation.mutate({
      email,
      role: ROLES.user,
      teamId,
      teamRole,
      websiteIds: websiteScope === 'selected' ? selectedWebsiteIds : undefined,
    });
  };

  const websites = websitesQuery.data?.data || [];

  return (
    <SettingsCard
      title="Invite to this team"
      description="New people join this team directly. Existing users receive the same team membership when they accept."
      action={<SettingsBadge tone="success">Team scoped</SettingsBadge>}
    >
      <form className={settingsKitStyles.inviteForm} onSubmit={handleSubmit}>
        <div className={settingsKitStyles.grid}>
          <SettingsField label="Email">
            <SettingsInput
              autoComplete="email"
              onChange={event => setEmail(event.currentTarget.value)}
              placeholder="teammate@company.com"
              required
              type="email"
              value={email}
            />
          </SettingsField>
          <SettingsField label={t(labels.role)}>
            <SettingsSelect
              onChange={event => setTeamRole(event.currentTarget.value)}
              value={teamRole}
            >
              {teamRoleOptions.map(role => (
                <option key={role} value={role}>
                  {getTeamRoleLabel(role)}
                </option>
              ))}
            </SettingsSelect>
          </SettingsField>
        </div>

        <div className={settingsKitStyles.accessScope}>
          <SettingsField label="Website access">
            <SettingsSelect
              onChange={event => {
                setWebsiteScope(event.currentTarget.value);
                if (event.currentTarget.value === 'all') {
                  setSelectedWebsiteIds([]);
                }
              }}
              value={websiteScope}
            >
              <option value="all">All team websites</option>
              <option value="selected">Selected websites</option>
            </SettingsSelect>
          </SettingsField>

          {websiteScope === 'selected' && (
            <div className={settingsKitStyles.checkboxList}>
              {websites.length === 0 ? (
                <div className={settingsKitStyles.emptyState}>
                  <MailCheck />
                  <span>No websites in this team yet.</span>
                </div>
              ) : (
                websites.map((website: any) => (
                  <label className={settingsKitStyles.checkboxRow} key={website.id}>
                    <input
                      checked={selectedWebsiteIds.includes(website.id)}
                      onChange={event => {
                        setSelectedWebsiteIds(current =>
                          event.currentTarget.checked
                            ? [...current, website.id]
                            : current.filter(id => id !== website.id),
                        );
                      }}
                      type="checkbox"
                    />
                    <span>{website.name}</span>
                    <small>{website.domain}</small>
                  </label>
                ))
              )}
            </div>
          )}
        </div>

        <div className={settingsKitStyles.actions}>
          <SettingsButton
            disabled={
              createInvitation.isPending ||
              (websiteScope === 'selected' && selectedWebsiteIds.length === 0)
            }
            type="submit"
            variant="primary"
          >
            <Send />
            Invite
          </SettingsButton>
        </div>
      </form>

      <div className={settingsKitStyles.listHeader}>
        <span>Pending team invitations</span>
        <SettingsBadge>{pendingInvitations.length}</SettingsBadge>
      </div>

      <div className={settingsKitStyles.inviteList}>
        {pendingInvitations.length === 0 ? (
          <div className={settingsKitStyles.emptyState}>
            <MailCheck />
            <span>No pending invitations for this team.</span>
          </div>
        ) : (
          pendingInvitations.map((invite: any) => (
            <div className={settingsKitStyles.inviteRow} key={invite.id}>
              <div className={settingsKitStyles.stack}>
                <span className={settingsKitStyles.email}>{invite.email}</span>
                <span className={settingsKitStyles.meta}>
                  {getTeamRoleLabel(invite.teamRole)} / {invite.status} / expires{' '}
                  {formatDate(invite.expiresAt)}
                </span>
                <span className={settingsKitStyles.meta}>
                  {formatWebsiteAccess(invite.websiteIds, websites)}
                </span>
              </div>
              <div className={settingsKitStyles.actions}>
                <SettingsBadge>{invite.status}</SettingsBadge>
                {invite.canResend && (
                  <SettingsButton
                    aria-label={`Resend invitation to ${invite.email}`}
                    disabled={resendInvitation.isPending}
                    onClick={() => resendInvitation.mutate(invite.id)}
                    variant="secondary"
                  >
                    <RefreshCw />
                    Resend
                  </SettingsButton>
                )}
                {invite.canRevoke && (
                  <SettingsButton
                    aria-label={`Revoke invitation for ${invite.email}`}
                    disabled={revokeInvitation.isPending}
                    onClick={() => revokeInvitation.mutate(invite.id)}
                    variant="ghost"
                  >
                    <Ban />
                    Revoke
                  </SettingsButton>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </SettingsCard>
  );
}

function formatWebsiteAccess(websiteIds: unknown, websites: any[]) {
  if (!Array.isArray(websiteIds) || websiteIds.length === 0) {
    return 'All team websites';
  }

  const names = websiteIds
    .map(websiteId => websites.find((website: any) => website.id === websiteId)?.name)
    .filter(Boolean);

  return names.length ? `Websites: ${names.join(', ')}` : `${websiteIds.length} selected websites`;
}

function getTeamRoleLabel(role: string) {
  switch (role) {
    case ROLES.teamManager:
      return 'Manager';
    case ROLES.teamViewOnly:
      return 'View only';
    default:
      return 'Member';
  }
}

function formatDate(value?: string) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}
