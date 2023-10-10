require("./config");
const mongoose = require("mongoose");
const { fakerES: faker } = require("@faker-js/faker");
const { DateTime } = require("luxon");
const { DogModel } = require("../src/components/dog");
const { OwnerModel } = require("../src/components/owner");
const { PassModel, PassOwnedModel } = require("../src/components/pass");
const { AttendanceModel } = require("../src/components/attendance");
const { BusinessDataModel } = require("../src/components/other");

async function seed() {
  const dogs = [];
  const owners = [];
  const passes = [];
  const passesOwned = [];
  const businessData = [];

  // OWNERS: Create
  for (let i = 0; i < 5; i++) {
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

  // OWNERS: Populate
  const createdOwners = await populate("owners", OwnerModel, owners);
  const createdOwnersIds = createdOwners.map((owner) => owner._id);

  // PASSES: Create
  passes.push({
    name: "Mensual Media Jornada",
    totalDays: 30,
    hoursPerDay: 4,
    price: 100,
  });
  passes.push({
    name: "Mensual Jornada Completa",
    totalDays: 30,
    hoursPerDay: 8,
    price: 200,
  });
  passes.push({
    name: "10 dias Media Jornada",
    totalDays: 10,
    hoursPerDay: 4,
    price: 20,
  });
  passes.push({
    name: "10 dias Jornada Completa",
    totalDays: 10,
    hoursPerDay: 8,
    price: 50,
  });

  // PASSES: Populate
  const createdPasses = await populate("passes", PassModel, passes);

  // PASSESOWNED: Create
  for (let i = 0; i < 3; i++) {
    const randomPass = createdPasses[Math.floor(Math.random() * passes.length)];
    const purchaseDate = faker.date.soon({ days: randomPass.totalDays });

    passesOwned.push({
      pass: randomPass._id,
      daysUsed: faker.number.int(randomPass.totalDays),
      purchaseDate,
      expirationDate: DateTime.fromISO(purchaseDate.toISOString())
        .plus({ days: 30 })
        .toISO(),
      active: true,
    });
  }

  // PASSESOWNED: Populate
  const createdPassesOwned = await populate(
    "passes_owned",
    PassOwnedModel,
    passesOwned
  );
  const createdPassesOwnedIds = createdPassesOwned.map(
    (createdPass) => createdPass._id
  );

  // DOGS: Create
  for (let i = 0; i < 5; i++) {
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
      vaccines: [
        {
          name: "parvovirus",
          dateAdministered: faker.date.between({
            from: dateOfBirth,
            to: recentDate,
          }),
        },
        {
          name: "distemper",
          dateAdministered: faker.date.between({
            from: dateOfBirth,
            to: recentDate,
          }),
        },
        {
          name: "multipurpose",
          dateAdministered: faker.date.between({
            from: dateOfBirth,
            to: recentDate,
          }),
        },
        {
          name: "rabies",
          dateAdministered: faker.date.between({
            from: dateOfBirth,
            to: recentDate,
          }),
        },
      ],
      fixed,
      heat: fixed
        ? null
        : faker.date.between({ from: dateOfBirth, to: recentDate }),
      chip: faker.string.numeric(10),
      scan: faker.string.numeric(15),
      owner,
      notes: faker.lorem.lines(1),
      passes: pass ? pass : [],
      active: true,
    });
  }

  // DOGS: Populate
  const createdDogs = await populate("dogs", DogModel, dogs);

  await AttendanceModel.deleteMany({}, () =>
    console.log("Attendances cleared")
  );

  // PRICE: Create
  businessData.push({
    key: "pricePerHour",
    value: 10,
  });

  // PRICE: Populate
  await populate("business_data", BusinessDataModel, businessData);
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
