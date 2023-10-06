require("./config");
const mongoose = require("mongoose");
const { fakerES: faker } = require("@faker-js/faker");
const { DogModel } = require("../src/components/dog");
const { OwnerModel } = require("../src/components/owner");
const { PassModel, PassOwnedModel } = require("../src/components/pass");
const { AttendanceModel } = require("../src/components/attendance");

async function seed() {
  const dogs = [];
  const owners = [];
  const pass = [];
  const passOwned = [];

  // Create 50 owners
  for (let i = 0; i < 50; i++) {
    owners.push({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: [faker.phone.number()],
      dni:
        faker.string.numeric(8) +
        faker.string.alpha({ casing: "lower", length: 1 }),
    });
  }

  // populate DB with owners
  const createdOwners = await populate("owners", OwnerModel, owners);
  // create an array of IDs from the created owners to pass to the dogs
  const createdOwnersIds = createdOwners.map((owner) => owner._id);

  // Create 4 passes
  pass.push({
    name: "Mensual Media Jornada",
    totalDays: 30,
    hoursPerDay: 4,
    price: 100,
  });
  pass.push({
    name: "Mensual Jornada Completa",
    totalDays: 30,
    hoursPerDay: 8,
    price: 200,
  });
  pass.push({
    name: "10 dias Media Jornada",
    totalDays: 10,
    hoursPerDay: 4,
    price: 20,
  });
  pass.push({
    name: "10 dias Jornada Completa",
    totalDays: 10,
    hoursPerDay: 8,
    price: 50,
  });

  // populate DB with passes
  const createdPasses = await populate("passes", PassModel, pass);

  // create 30 passOwned for dogs
  for (let i = 0; i < 30; i++) {
    const randomPass = createdPasses[Math.floor(Math.random() * pass.length)];

    passOwned.push({
      pass: randomPass._id,
      daysUsed: faker.number.int(randomPass.totalDays),
      expiration: faker.date.soon(randomPass.totalDays),
      active: true,
    });
  }

  // populate DB with passesOwned
  const createdPassesOwned = await populate(
    "passes_owned",
    PassOwnedModel,
    passOwned
  );
  // get ID
  const createdPassesOwnedIds = createdPassesOwned.map(
    (createdPass) => createdPass._id
  );

  // Create 50 fake dogs
  for (let i = 0; i < 50; i++) {
    const dateOfBirth = faker.date.birthdate({
      min: 2010,
      max: 2022,
      mode: "year",
    });
    const recentDate = faker.date.recent();
    const fixed = faker.datatype.boolean();
    const ownersCopy = [...owners];
    const owner = createdOwnersIds.pop();
    const pass = createdPassesOwnedIds.pop();

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
      owner,
      notes: faker.lorem.lines(1),
      pass,
    });
  }

  // populate DB with dogs
  const createdDogs = await populate("dogs", DogModel, dogs);

  await AttendanceModel.deleteMany({}, () =>
    console.log("Attendances cleared")
  );
}

// populate DB function
async function populate(name, model, array) {
  try {
    // clear data from DB
    await model.deleteMany({}, () => console.log(`${name} cleared`));

    // create new data
    const dbData = await model.create(array);
    console.log(`${dbData.length} ${name} created`);

    // return created data
    return dbData;
  } catch (error) {
    console.error(`There was an error creating the ${name}:`, error);
  }
}

seed().then((res) => mongoose.connection.close());
