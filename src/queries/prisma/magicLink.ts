import prisma from '@/lib/prisma';

const client = prisma.client as any;

export function createMagicLink(data: Record<string, any>) {
  return client.magicLink.create({
    data,
  });
}

export function markMagicLinkSent(magicLinkId: string) {
  return client.magicLink.update({
    where: {
      id: magicLinkId,
    },
    data: {
      sentAt: new Date(),
    },
  });
}

export function getMagicLinkByTokenHash(tokenHash: string) {
  return client.magicLink.findUnique({
    where: {
      tokenHash,
    },
    include: {
      user: true,
    },
  });
}

export function consumeMagicLink(magicLinkId: string) {
  return client.magicLink.updateMany({
    where: {
      id: magicLinkId,
      consumedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    data: {
      consumedAt: new Date(),
    },
  });
}

export function pruneMagicLinks() {
  return client.magicLink.deleteMany({
    where: {
      OR: [
        {
          expiresAt: {
            lt: new Date(),
          },
        },
        {
          consumedAt: {
            not: null,
          },
        },
      ],
    },
  });
}
