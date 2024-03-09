"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRandomEvent = exports.createRandomUser = void 0;
// script to seed databse with dummy data
const faker_1 = require("@faker-js/faker");
function createRandomUser() {
    const email = faker_1.faker.internet.email().toLocaleLowerCase();
    const imageURL = faker_1.faker.image.avatar();
    const firstName = faker_1.faker.person.firstName();
    const lastName = faker_1.faker.person.lastName();
    const nickname = faker_1.faker.person.firstName();
    const phone = faker_1.faker.phone.number();
    const role = faker_1.faker.helpers.arrayElement([
        "VOLUNTEER",
        "ADMIN",
        "SUPERVISOR",
    ]);
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
exports.createRandomUser = createRandomUser;
function createRandomEvent() {
    const name = faker_1.faker.lorem.words(3);
    const description = faker_1.faker.lorem.paragraph();
    const location = `${(faker_1.faker.location.buildingNumber, faker_1.faker.location.city())}, ${faker_1.faker.location.state()}`;
    const startDate = faker_1.faker.date.soon();
    const endDate = faker_1.faker.date.future();
    const capacity = faker_1.faker.number.int({ min: 10, max: 1000 });
    const imageURL = faker_1.faker.image.urlLoremFlickr({ category: "people" });
    const status = faker_1.faker.helpers.arrayElement([
        "DRAFT",
        "ACTIVE",
        "CANCELLED",
        "COMPLETED",
    ]);
    const mode = faker_1.faker.helpers.arrayElement(["IN_PERSON", "VIRTUAL"]);
    const tags = faker_1.faker.lorem.words(3).split(" ");
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
exports.createRandomEvent = createRandomEvent;
