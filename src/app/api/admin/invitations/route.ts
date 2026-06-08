import { z } from 'zod';
import { createOpaqueToken, hashAuthToken, normalizeLoginIdentifier } from '@/lib/auth-tokens';
import {
  isAuthEmailConfigured,
  renderInvitationEmail,
  sendAuthEmail,
} from '@/lib/cosmolytics-auth-email';
import { uuid } from '@/lib/crypto';
import { getAuthLinkBaseUrl } from '@/lib/get-base-url';
import { getQueryFilters, parseRequest } from '@/lib/request';
import { badRequest, json, unauthorized } from '@/lib/response';
import { pagingParams, searchParams, teamRoleParam, userRoleParam } from '@/lib/schema';
import { canCreateUser, canUpdateTeam, canViewUsers } from '@/permissions';
import { createInvitation, getInvitations, getTeamUser, getUserByUsername } from '@/queries/prisma';
import { ROLES } from '@/lib/constants';

const invitationTtlDays = 7;

export async function GET(request: Request) {
  const schema = z.object({
    ...pagingParams,
    ...searchParams,
  });

  const { auth, query, error } = await parseRequest(request, schema);

  if (error) {
    return error();
  }

  if (!(await canViewUsers(auth))) {
    return unauthorized();
  }

  const filters = await getQueryFilters(query);
  const invitations = await getInvitations(filters);

  return json({
    ...invitations,
    data: invitations.data.map(toInvitationView),
    emailConfigured: isAuthEmailConfigured(),
  });
}

export async function POST(request: Request) {
  const schema = z.object({
    email: z.string().email().max(255),
    role: userRoleParam.default(ROLES.user),
    teamId: z.uuid().optional(),
    teamRole: teamRoleParam.optional(),
  });

  const { auth, body, error } = await parseRequest(request, schema);

  if (error) {
    return error();
  }

  if (body.teamId) {
    if (!(await canUpdateTeam(auth, body.teamId))) {
      return unauthorized({ message: 'You must be the owner/manager of this team.' });
    }
  } else if (!(await canCreateUser(auth))) {
    return unauthorized();
  }

  const email = normalizeLoginIdentifier(body.email);
  const existingUser = await getUserByUsername(email, { showDeleted: true });

  if (existingUser && !body.teamId) {
    return badRequest({ message: 'User already exists.' });
  }

  if (existingUser && body.teamId && (await getTeamUser(body.teamId, existingUser.id))) {
    return badRequest({ message: 'User is already a member of this team.' });
  }

  const deliveryToken = createOpaqueToken();
  const expiresAt = new Date(Date.now() + invitationTtlDays * 24 * 60 * 60 * 1000);
  const delivery = await sendInvitationEmail(email, deliveryToken);
  const invitation = await createInvitation({
    id: uuid(),
    email,
    role: body.role,
    teamId: body.teamId,
    teamRole: body.teamId ? body.teamRole || ROLES.teamMember : null,
    invitedById: auth.user.id,
    tokenHash: hashAuthToken(deliveryToken),
    expiresAt,
    sentAt: delivery.sent ? new Date() : null,
  });

  return json({
    ...toInvitationView(invitation),
    emailDelivery: delivery.sent ? 'sent' : delivery.reason,
  });
}

async function sendInvitationEmail(email: string, token: string) {
  const baseUrl = getAuthLinkBaseUrl();
  const url = new URL(`${process.env.basePath || ''}/invite`, baseUrl);
  url.searchParams.set('token', token);
  const emailBody = renderInvitationEmail({ url: url.toString() });

  return sendAuthEmail({
    kind: 'invitation',
    to: email,
    url: url.toString(),
    ...emailBody,
  });
}

function toInvitationView(invitation: any) {
  const now = Date.now();
  const expiresAt = invitation.expiresAt ? new Date(invitation.expiresAt).getTime() : 0;
  const status = invitation.acceptedAt
    ? 'accepted'
    : invitation.revokedAt
      ? 'revoked'
      : expiresAt <= now
        ? 'expired'
        : invitation.sentAt
          ? 'sent'
          : 'pending';

  return {
    id: invitation.id,
    email: invitation.email,
    role: invitation.role,
    teamId: invitation.teamId,
    teamRole: invitation.teamRole,
    status,
    sentAt: invitation.sentAt,
    expiresAt: invitation.expiresAt,
    acceptedAt: invitation.acceptedAt,
    revokedAt: invitation.revokedAt,
    createdAt: invitation.createdAt,
    invitedBy: invitation.invitedBy,
    acceptedUser: invitation.acceptedUser,
    team: invitation.team,
    canResend: !invitation.acceptedAt,
    canRevoke: !invitation.acceptedAt && !invitation.revokedAt,
  };
}
