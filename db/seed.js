require("./config");
const mongoose = require("mongoose");
const { fakerES: faker } = require("@faker-js/faker");
const { DogModel } = require("../src/components/dog");
const { OwnerModel } = require("../src/components/owner");

const dogs = [];
const owners = [];

// Create 50 owners
for (let i = 0; i < 50; i++) {
  owners.push({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    dni:
      faker.string.numeric(8) +
      faker.string.alpha({ casing: "lower", length: 1 }),
  });
}

// Create 50 fake dogs
for (let i = 0; i < 50; i++) {
  const dateOfBirth = faker.date.birthdate({
    min: 2010,
    max: 2022,
    mode: "year",
  });
  const recentDate = faker.date.recent();
  const fixed = faker.datatype.boolean();
  const owner = owners.pop();

  dogs.push({
    name: faker.person.firstName(),
    breed: faker.animal.dog(),
    sex: faker.person.sex(),
    dateOfBirth,
    vaccines: {
      parvovirus: faker.date.between({ from: dateOfBirth, to: recentDate }),
      distemper: faker.date.between({ from: dateOfBirth, to: recentDate }),
      multipurpose: faker.date.between({ from: dateOfBirth, to: recentDate }),
      rabies: faker.date.between({ from: dateOfBirth, to: recentDate }),
    },
    fixed,
    heat: fixed
      ? null
      : faker.date.between({ from: dateOfBirth, to: recentDate }),
    chip: faker.string.numeric(10),
    scan: faker.string.numeric(15),
    owners: null,
    notes: faker.lorem.lines(1),
  });
}

// Populate DB
OwnerModel.deleteMany({}, () => console.log("Owners cleared"));
OwnerModel.create(owners)
  .then((res) => {
    console.log(`Inserted ${res.length} records.`);
  })
  .catch((err) => {
    console.log(err);
  });

DogModel.deleteMany({}, () => console.log("Dogs cleared"));
DogModel.create(dogs)
  .then((res) => {
    console.log(`Inserted ${res.length} records.`);
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log(err);
  });
