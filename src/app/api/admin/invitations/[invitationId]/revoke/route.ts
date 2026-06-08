import { parseRequest } from '@/lib/request';
import { badRequest, json, notFound, unauthorized } from '@/lib/response';
import { canCreateUser, canUpdateTeam } from '@/permissions';
import { getInvitation, revokeInvitation } from '@/queries/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ invitationId: string }> },
) {
  const { auth, error } = await parseRequest(request);

  if (error) {
    return error();
  }

  const { invitationId } = await params;
  const invitation = await getInvitation(invitationId);

  if (!invitation) {
    return notFound();
  }

  if (invitation.teamId) {
    if (!(await canUpdateTeam(auth, invitation.teamId))) {
      return unauthorized({ message: 'You must be the owner/manager of this team.' });
    }
  } else if (!(await canCreateUser(auth))) {
    return unauthorized();
  }

  if (invitation.acceptedAt) {
    return badRequest({ message: 'Invitation has already been accepted.' });
  }

  await revokeInvitation(invitationId);

  return json({ ok: true });
}
