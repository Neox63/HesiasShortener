import { before, after, test } from "node:test";
import request from "supertest";
import { app } from "../src/app.js";
import { prisma } from "../src/db.js";
import bcrypt from "bcrypt";

const cookies = {};

async function loginAs(email) {
  const res = await request(app)
    .post("/login")
    .type("form")
    .send({ email, password: "RootRoot123" });

  return res.headers["set-cookie"];
}

before(async () => {
  await prisma.link.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("RootRoot123", 4);

  const alice = await prisma.user.create({
    data: { email: "alice@test.dev", passwordHash },
  });

  await prisma.user.create({
    data: { email: "bob@test.dev", passwordHash },
  });

  await prisma.user.create({
    data: { email: "admin@test.dev", passwordHash },
  });

  await prisma.link.create({
    data: {
      code: "alice-1",
      url: "https://example.com",
      userId: alice.id,
    },
  });
  await prisma.link.create({
    data: {
      code: "old",
      url: "https://example.com",
      userId: alice.id,
      expiresAt: new Date("2020-01-01"),
    },
  });

  cookies.alice = await loginAs("alice@test.dev");
  cookies.bob = await loginAs("bob@test.dev");
  cookies.admin = await loginAs("admin@test.dev");
});

after(() => prisma.$disconnect());

test("The API needs a login : HTTP 401", async () => {
  await request(app).get("/api/links").expect(401);
});
