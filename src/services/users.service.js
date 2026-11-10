import { prisma } from "../db.js";

export async function loadUsers() {
  const users = await prisma.user.findMany({
    select: {
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          links: true,
        },
      },
    },
  });

  return users.map(({ _count, ...user }) => ({ ...user, links: _count.links }));
}
