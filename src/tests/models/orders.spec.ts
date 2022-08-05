import { Order, OrderStore } from "../../models/orders";

const store = new OrderStore();
const orders: Order[] = [
  {
    o_id: 36,
    u_id: 1,
    o_status: "active",
  },
];

describe("Order Model", () => {
  it("should contain show method", () => {
    expect(store.show).toBeDefined();
  });

  it("show method return active orders by u_id", async () => {
    const result = await store.show(1);
    const order = jasmine.objectContaining(orders[0]);
    expect(result).toEqual(order);
  });
});
