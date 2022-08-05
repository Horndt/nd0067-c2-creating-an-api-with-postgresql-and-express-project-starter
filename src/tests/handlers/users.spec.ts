import app from "../../server";
import supertest from "supertest";

const request = supertest(app);
const user = [
  {
    user_name: "PBIG",
    first_name: "Paul",
    last_name: "Big",
    user_password: "Paulspassword",
  },
  {
    user_name: "Boss",
    first_name: "Hassan",
    last_name: "Ali",
    user_password: "boss_password",
  },
];

describe("user Test Endpoints", () => {
  let token: string;

  it("api create should open with status 200", async () => {
    const response = await request.post("/users/create").send(user[0]);
    expect(response.status).toBe(200);
    token = response.body;
  });

  it("api signIn should open with status 200", async () => {
    const response = await request
      .post("/users/signIn")
      .send(user[0])
      .set("Approved", "json");
    token = "Crypt " + response.body;
    expect(response.status).toBe(200);
  });

  it("api index should open with status 200", async () => {
    const response = await request.get("/users").set("Authorization", token);
    expect(response.status).toBe(200);
  });

  it("api index should open with status 401 for invalid token", async () => {
    token = "Crypt " + token;
    const response = await request.get("/users").set("Authorization", token);
    expect(response.status).toBe(401);
  });
});
