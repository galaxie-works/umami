'use client';

import { Ban, Check, ChevronDown, MailCheck, RefreshCw, Send } from 'lucide-react';
import { type FormEvent, useMemo, useState } from 'react';
import { useApi, useMessages, useModified } from '@/components/hooks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ROLES } from '@/lib/constants';

const teamRoleOptions = [ROLES.teamManager, ROLES.teamMember, ROLES.teamViewOnly];

export function TeamInvitePanel({ teamId }: { teamId: string }) {
  const { get, post, useMutation, useQuery } = useApi();
  const { touch } = useModified();
  const { t, labels } = useMessages();
  const [email, setEmail] = useState('');
  const [teamRole, setTeamRole] = useState<string>(ROLES.teamMember);
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
      setSelectedWebsiteIds([]);
      touch('team:users');
      invitationsQuery.refetch();
    },
  });

  const resendInvitation = useMutation({
    mutationFn: (invitationId: string) => post(`/admin/invitations/${invitationId}/resend`),
    onSuccess: () => {
      invitationsQuery.refetch();
    },
  });

  const revokeInvitation = useMutation({
    mutationFn: (invitationId: string) => post(`/admin/invitations/${invitationId}/revoke`),
    onSuccess: () => {
      invitationsQuery.refetch();
    },
  });

  const pendingInvitations = useMemo(
    () => (invitationsQuery.data?.data || []).filter((invite: any) => invite.status !== 'accepted'),
    [invitationsQuery.data?.data, teamId],
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    createInvitation.mutate({
      email,
      role: ROLES.user,
      teamId,
      teamRole,
      websiteIds: selectedWebsiteIds.length ? selectedWebsiteIds : undefined,
    });
  };

  const websites = websitesQuery.data?.data || [];
  const setWebsiteSelection = (updater: (current: string[]) => string[]) => {
    setSelectedWebsiteIds(current => {
      const next = updater(current);

      if (next.length && teamRole === ROLES.teamManager) {
        setTeamRole(ROLES.teamMember);
      }

      return next;
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Invite to this team</CardTitle>
          <CardDescription>
            New people join this team directly. Existing users receive the same team membership when
            they accept.
          </CardDescription>
        </div>
        <Badge variant="outline">Team scoped</Badge>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_180px]">
            <div className="grid gap-2">
              <Label htmlFor="team-invite-email">Email</Label>
              <Input
                autoComplete="email"
                id="team-invite-email"
                onChange={event => setEmail(event.currentTarget.value)}
                placeholder="teammate@company.com"
                required
                type="email"
                value={email}
              />
            </div>
            <div className="grid gap-2">
              <Label>{t(labels.role)}</Label>
              <Select onValueChange={value => setTeamRole(value)} value={teamRole}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {teamRoleOptions.map(role => (
                    <SelectItem
                      disabled={role === ROLES.teamManager && selectedWebsiteIds.length > 0}
                      key={role}
                      value={role}
                    >
                      {getTeamRoleLabel(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Website access</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full justify-between" type="button" variant="outline">
                  <span className="truncate">
                    {formatWebsiteSelection(selectedWebsiteIds, websites)}
                  </span>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-72">
                <DropdownMenuLabel>Website access</DropdownMenuLabel>
                <DropdownMenuItem onSelect={() => setSelectedWebsiteIds([])}>
                  <span className="flex size-4 items-center justify-center rounded-sm border border-input">
                    {selectedWebsiteIds.length === 0 && <Check className="size-3" />}
                  </span>
                  <div className="flex flex-col">
                    <span>All team websites</span>
                    <span className="text-xs text-muted-foreground">Default access</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {websites.length === 0 ? (
                  <div className="flex items-center gap-2 px-2 py-3 text-sm text-muted-foreground">
                    <MailCheck className="size-4" />
                    <span>No websites in this team yet.</span>
                  </div>
                ) : (
                  websites.map((website: any) => (
                    <DropdownMenuCheckboxItem
                      checked={selectedWebsiteIds.includes(website.id)}
                      key={website.id}
                      onCheckedChange={checked => {
                        setWebsiteSelection(current =>
                          checked
                            ? [...current, website.id]
                            : current.filter(id => id !== website.id),
                        );
                      }}
                    >
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate">{website.name}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {website.domain}
                        </span>
                      </div>
                    </DropdownMenuCheckboxItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex">
            <Button disabled={createInvitation.isPending} type="submit">
              <Send className="size-4" />
              Invite
            </Button>
          </div>
        </form>

        <div className="flex items-center justify-between border-t border-border pt-5">
          <span className="font-medium">Pending team invitations</span>
          <Badge variant="outline">{pendingInvitations.length}</Badge>
        </div>

        <div className="flex flex-col gap-3">
          {pendingInvitations.length === 0 ? (
            <div className="flex min-h-24 items-center justify-center gap-2 rounded-lg border border-dashed border-border text-sm text-muted-foreground">
              <MailCheck className="size-4" />
              <span>No pending invitations for this team.</span>
            </div>
          ) : (
            pendingInvitations.map((invite: any) => (
              <div
                className="flex flex-col justify-between gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center"
                key={invite.id}
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="truncate font-medium">{invite.email}</span>
                  <span className="text-sm text-muted-foreground">
                    {getTeamRoleLabel(invite.teamRole)} / {invite.status} / expires{' '}
                    {formatDate(invite.expiresAt)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatWebsiteAccess(invite.websiteIds, websites)}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{invite.status}</Badge>
                  {invite.canResend && (
                    <Button
                      aria-label={`Resend invitation to ${invite.email}`}
                      disabled={resendInvitation.isPending}
                      onClick={() => resendInvitation.mutate(invite.id)}
                      variant="secondary"
                    >
                      <RefreshCw className="size-4" />
                      Resend
                    </Button>
                  )}
                  {invite.canRevoke && (
                    <Button
                      aria-label={`Revoke invitation for ${invite.email}`}
                      disabled={revokeInvitation.isPending}
                      onClick={() => revokeInvitation.mutate(invite.id)}
                      variant="outline"
                    >
                      <Ban className="size-4" />
                      Revoke
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function formatWebsiteSelection(websiteIds: string[], websites: any[]) {
  if (!websiteIds.length) {
    return 'All team websites';
  }

  const names = websiteIds
    .map(websiteId => websites.find((website: any) => website.id === websiteId)?.name)
    .filter(Boolean);

  if (names.length === 1) {
    return names[0];
  }

  return names.length
    ? `${names.length} websites selected`
    : `${websiteIds.length} websites selected`;
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
