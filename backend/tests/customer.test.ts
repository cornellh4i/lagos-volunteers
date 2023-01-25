import { dbConnect, dbDisconnect } from "../src/database";
import CustomerController from "../src/customers/controllers";
import { Customer } from "../src/customers/models";

beforeAll(async () => {
  await dbConnect();
});

afterAll(async () => {
  await dbDisconnect();
});

describe("Customer Retreival Tests", () => {
  test("Get all customers", async () => {
    const allCustomers = await CustomerController.getCustomers();
    expect(allCustomers.length).toBeGreaterThan(0);
    for (let customer of allCustomers) {
      expect(customer.name).toBeDefined();
      expect(customer.age).toBeDefined();
    }
  });
});
