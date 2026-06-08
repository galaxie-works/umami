'use client';

import { Ban, RefreshCw, Send } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { useToast } from '@umami/react-zen';
import { useApi, useModified } from '@/components/hooks';
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

const roleOptions = [
  { value: ROLES.user, label: 'User' },
  { value: ROLES.viewOnly, label: 'View only' },
  { value: ROLES.admin, label: 'Admin' },
];

export function UserInvitePanel() {
  const { get, post, useMutation, useQuery } = useApi();
  const { toast } = useToast();
  const { touch } = useModified();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<string>(ROLES.user);

  const invitationsQuery = useQuery({
    queryKey: ['admin:invitations'],
    queryFn: () => get('/admin/invitations', { pageSize: 50 }),
  });

  const createInvitation = useMutation({
    mutationFn: (data: Record<string, any>) => post('/admin/invitations', data),
    onSuccess: () => {
      setEmail('');
      toast('Invitation queued.');
      touch('users');
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

  const invitations = invitationsQuery.data?.data || [];
  const pendingInvitations = useMemo(
    () => invitations.filter((invite: any) => invite.status !== 'accepted'),
    [invitations],
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    createInvitation.mutate({ email, role });
  };

  return (
    <SettingsCard
      title="User access"
      description="Invite teammates by email. Links are sent through the configured email transport and are never displayed in the UI."
      action={<SettingsBadge tone="success">Cosmolytics flow</SettingsBadge>}
    >
      {!invitationsQuery.data?.emailConfigured && (
        <div className={settingsKitStyles.notice}>
          Email delivery is not configured yet. Set AUTH_EMAIL_WEBHOOK_URL to send invitations and
          magic links.
        </div>
      )}

      <form className={settingsKitStyles.grid} onSubmit={handleSubmit}>
        <SettingsField label="Email">
          <SettingsInput
            autoComplete="email"
            data-test="input-invite-email"
            onChange={event => setEmail(event.currentTarget.value)}
            placeholder="teammate@company.com"
            required
            type="email"
            value={email}
          />
        </SettingsField>
        <SettingsField label="Role">
          <SettingsSelect
            data-test="select-invite-role"
            onChange={event => setRole(event.currentTarget.value)}
            value={role}
          >
            {roleOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SettingsSelect>
        </SettingsField>
        <SettingsButton
          data-test="button-send-invite"
          disabled={createInvitation.isPending}
          type="submit"
          variant="primary"
        >
          <Send />
          Invite
        </SettingsButton>
      </form>

      {pendingInvitations.length === 0 ? (
        <div className={settingsKitStyles.empty}>No pending invitations.</div>
      ) : (
        pendingInvitations.map((invite: any) => (
          <div className={settingsKitStyles.row} key={invite.id}>
            <div className={settingsKitStyles.stack}>
              <span className={settingsKitStyles.email}>{invite.email}</span>
              <span className={settingsKitStyles.meta}>
                {invite.role} · {invite.status} · expires {formatDate(invite.expiresAt)}
              </span>
            </div>
            <div className={settingsKitStyles.actions}>
              <SettingsBadge>{invite.status}</SettingsBadge>
              {invite.canResend && (
                <SettingsButton
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
    </SettingsCard>
  );
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
