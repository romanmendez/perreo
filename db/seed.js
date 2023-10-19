require("module-alias/register");
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
  const inactivePassesOwned = [];
  const activePassesOwned = [];
  const businessData = [];
  const attendances = [];

  // OWNERS: Create
  for (let i = 0; i < 5; i++) {
    owners.push({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: [faker.phone.number()],
      dni:
        faker.string.numeric(8) +
        faker.string.alpha({ casing: "upper", length: 1 }),
    });
  }

  // OWNERS: Populate
  const createdOwners = await populate("owners", OwnerModel, owners);
  const createdOwnersIds = createdOwners.map((owner) => owner._id);

  // PASSES: Create
  const monthlyPartTime = {
    name: "Mensual Media Jornada",
    totalDays: 30,
    hoursPerDay: 4,
    price: 100,
  };
  const monthlyFullTime = {
    name: "Mensual Jornada Completa",
    totalDays: 30,
    hoursPerDay: 8,
    price: 200,
  };
  const tenDayPartTime = {
    name: "10 dias Media Jornada",
    totalDays: 10,
    hoursPerDay: 4,
    price: 20,
  };
  const tenDayFullTime = {
    name: "10 dias Jornada Completa",
    totalDays: 10,
    hoursPerDay: 8,
    price: 50,
  };

  const passes = [
    monthlyFullTime,
    monthlyPartTime,
    tenDayFullTime,
    tenDayPartTime,
  ];

  // PASSES: Populate
  const createdPasses = await populate("passes", PassModel, passes);

  // PASSESOWNED: Create inactive passed
  for (let i = 0; i < 10; i++) {
    const randomPass = createdPasses[Math.floor(Math.random() * passes.length)];
    const purchaseDate = faker.date.past({ years: 1 });

    inactivePassesOwned.push({
      pass: randomPass._id,
      daysUsed: faker.number.int(randomPass.totalDays),
      startDate: purchaseDate,
      expirationDate: DateTime.fromISO(purchaseDate.toISOString())
        .plus({ days: 30 })
        .toISO(),
      isActive: false,
    });
  }

  // PASSESOWNED: Create active passes
  createdPasses.forEach((pass) =>
    activePassesOwned.push({
      pass,
      daysUsed: faker.number.int(pass.totalDays),
      startDate: DateTime.now().minus({ days: 29 }),
      expirationDate: DateTime.now().plus({ days: 1 }),
      isActive: true,
    })
  );

  // PASSESOWNED: Populate
  const createdPassesOwned = await populate("passes_owned", PassOwnedModel, [
    ...inactivePassesOwned,
    ...activePassesOwned,
  ]);
  const createdInactivePassesOwnedIds = createdPassesOwned
    .filter((createdPass) => !createdPass.isActive)
    .map((inactivePass) => inactivePass._id);
  const createdActivePassesOwnedIds = createdPassesOwned
    .filter((createdPass) => createdPass.isActive)
    .map((activePass) => activePass._id);

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
    const pass = [
      createdActivePassesOwnedIds.pop(),
      createdInactivePassesOwnedIds.pop(),
      createdInactivePassesOwnedIds.pop(),
    ];

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
      notes: [
        {
          key: faker.color.human(),
          value: faker.lorem.lines(1),
          isActive: faker.datatype.boolean(),
        },
      ],
      passes: pass ? pass : [],
      owners: [owner],
    });
  }

  // DOGS: Populate
  const createdDogs = await populate("dogs", DogModel, dogs);

  // ATTENDANCES: Create
  for (let i = 0; i < 10; i++) {
    const randomDog =
      createdDogs[Math.floor(Math.random() * createdDogs.length)];
    const startTime = faker.date.past({ years: 1 });
    const endTime = DateTime.fromISO(startTime.toISOString())
      .plus({ hours: faker.number.int(9) })
      .toISO();

    attendances.push({
      dog: randomDog,
      start: startTime,
      end: endTime,
    });
  }

  // ATTENDANCE: Populate
  await populate("attendance", AttendanceModel, attendances);

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
