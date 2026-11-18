import { before, after, test } from "node:test";
import request from "supertest";
import { app } from "../src/app.js";
import { prisma } from "../src/db.js";
import bcrypt from "bcrypt";
import assert from "node:assert/strict";

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
    data: { email: "admin@test.dev", role: "ADMIN", passwordHash },
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

test("Alice voit ses liens, et pas bob", async () => {
  const alice = await request(app)
    .get("/api/links")
    .set("Cookie", cookies.alice)
    .expect(200);

  assert.ok(alice.body.some((link) => link.code === "alice-1"));

  const bob = await request(app).get("/api/links").set("Cookie", cookies.bob).expect(200);

  assert.equal(bob.body.length, 0);
});

test("an invalid URL: 400", async () => {
  await request(app)
    .post("/api/links")
    .set("Cookie", cookies.alice)
    .send({ url: "trrzehez" })
    .expect(400);
});

test("creating a link: 201, a code and an expiry date", async () => {
  const res = await request(app)
    .post("/api/links")
    .set("Cookie", cookies.alice)
    .send({ url: "https://github.com" })
    .expect(201);

  assert.equal(res.body.code.length, 8);
  assert.ok(new Date(res.body.expiresAt) > new Date());
});

test("Bob cannot delete Alice's link: 403", async () => {
  await request(app).delete("/api/links/alice-1").set("Cookie", cookies.bob).expect(403);
});

test("an unknown code: 404", async () => {
  await request(app).get("/api/links/rzetzrze").set("Cookie", cookies.alice).expect(404);
});

test("a short link redirects (302) and saves a click", async () => {
  const before = await prisma.click.count();

  await request(app)
    .get("/alice-1")
    .expect(302)
    .expect("Location", "https://example.com");

  const after = await prisma.click.count();

  assert.equal(after, before + 1);
});

test("an expired link: 410", async () => {
  await request(app).get("/old").expect(410);
});

test("/admin: 403 for Alice, 200 for the admin", async () => {
  await request(app).get("/admin").set("Cookie", cookies.alice).expect(403);
  await request(app).get("/admin").set("Cookie", cookies.admin).expect(200);
});
