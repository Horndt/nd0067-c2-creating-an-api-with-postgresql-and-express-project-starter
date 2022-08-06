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
];

describe("Test Endpoints from Users", () => {
  let verifytoken: string;

  it("api create open with status 200", async () => {
    const response = await request.post("/users/create").send(user[0]);
    expect(response.status).toBe(200);
    verifytoken = response.body;
  });

  it("api signIn open with status 200", async () => {
    const response = await request
      .post("/users/signIn")
      .send(user[0])
      .set("Approved", "json");
    verifytoken = "Crypt " + response.body;
    expect(response.status).toBe(200);
  });

  it("api index open with status 200", async () => {
    const response = await request
      .get("/users")
      .set("Authorization", verifytoken);
    expect(response.status).toBe(200);
  });

  it("api index open with status 401 for invalid token", async () => {
    verifytoken = "Crypt " + verifytoken;
    const response = await request
      .get("/users")
      .set("Authorization", verifytoken);
    expect(response.status).toBe(401);
  });
});
