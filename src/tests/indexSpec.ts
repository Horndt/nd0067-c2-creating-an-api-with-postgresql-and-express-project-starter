import supertest from "supertest";
import app from "../server";

const request: supertest.SuperTest<supertest.Test> = supertest(app);

describe("Test responses endpoints", (): void => {
  describe("endpoint: /", (): void => {
    it("gets /", async () => {
      const response: supertest.Response = await request.get("/");

      expect(response.status).toBe(200);
    });
  });
});
