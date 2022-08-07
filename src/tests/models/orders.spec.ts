import { Order, OrderStore } from "../../models/orders";

const store = new OrderStore();
const orders: Order[] = [
  {
    id: 36,
    u_id: 1,
    o_status: "active",
  },
];

describe("Model Order", () => {
  it("should contain show method", () => {
    expect(store.show).toBeDefined();
  });

  it("return active orders by id", async () => {
    const result = await store.show(1);
    const order = jasmine.objectContaining(orders[0]);
    expect(result).toEqual(order);
  });
});
