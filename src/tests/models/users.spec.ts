import { User, UserStore } from "../../models/users";

const store = new UserStore();
const users = [
  {
    user_name: "PBIG",
    first_name: "Paul",
    last_name: "Big",
  },
];

describe("User Model", () => {
  const user: User = {
    user_name: users[0].user_name,
    first_name: users[0].first_name,
    last_name: users[0].last_name,
    user_password: "Paulspassword",
  };

  it("should contain create method", () => {
    expect(store.create).toBeDefined();
  });

  it("should add user through create method ", async () => {
    const result = await store.create(user);
    expect(result).toBeTruthy;
  });

  it("should contain index method", () => {
    expect(store.index).toBeDefined();
  });

  it("index method should return the entire list of users", async () => {
    const result = await store.index();
    const usr = jasmine.objectContaining(users[0]);
    expect(result).toContain(usr);
  });

  it("should contain show method", () => {
    expect(store.show).toBeDefined();
  });

  it("show method should return the selected user", async () => {
    const result = await store.show(3);
    const usr = jasmine.objectContaining(users[0]);
    expect(result).toEqual(usr);
  });

  it("should contain authenticate method", () => {
    expect(store.authenticate).toBeDefined();
  });

  it("authenticate method should confirm the user existence", async () => {
    const result = await store.authenticate(user.user_name, user.user_password);
    expect(result).not.toBeNull;
  });
});
