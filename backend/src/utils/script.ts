// script to seed databse with dummy data
import { faker } from "@faker-js/faker";

type Role = "VOLUNTEER" | "ADMIN" | "SUPERVISOR";

export interface dummyUser {
  email: string;
  imageURL: string;
  firstName: string;
  lastName: string;
  nickname: string;
  role: Role;
  phone?: string;
}

type Mode = "IN_PERSON" | "VIRTUAL";
type Status = "DRAFT" | "ACTIVE" | "CANCELED" | "COMPLETED";

export interface dummyEvent {
  name: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  capacity: number;
  imageURL?: string;
  status?: string;
  mode?: Mode;
  tags?: string[];
}

export function createRandomUser(): dummyUser {
  const email = faker.internet.email().toLocaleLowerCase();
  const imageURL = faker.image.avatar();
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const nickname = faker.person.firstName();
  const phone = faker.phone.number();
  const role = faker.helpers.arrayElement([
    "VOLUNTEER",
    "ADMIN",
    "SUPERVISOR",
  ]) as Role;

  return {
    email,
    imageURL,
    firstName,
    lastName,
    nickname,
    role,
    phone,
  };
}

export function createRandomEvent(): dummyEvent {
  const name = faker.lorem.words(3);
  const description = faker.lorem.paragraph();
  const location = `${
    (faker.location.buildingNumber, faker.location.city())
  }, ${faker.location.state()}`;
  const startDate = faker.date.soon();
  const endDate = new Date(startDate);
  endDate.setHours(
    startDate.getHours() + faker.number.int({ min: 1, max: 12 })
  );
  const capacity = faker.number.int({ min: 10, max: 1000 });
  const imageURL = faker.image.urlLoremFlickr({ category: "people" });
  const status = faker.helpers.arrayElement([
    "DRAFT",
    "ACTIVE",
    "CANCELLED",
    "COMPLETED",
  ]) as Status;
  const mode = faker.helpers.arrayElement(["IN_PERSON", "VIRTUAL"]) as Mode;
  const tags = faker.lorem.words(3).split(" ");

  return {
    name,
    description,
    location,
    startDate,
    endDate,
    capacity,
    imageURL,
    status,
    mode,
    tags,
  };
}
