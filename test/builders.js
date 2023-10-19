const { fakerES: faker } = require("@faker-js/faker");
const { DateTime } = require("luxon");

// PASSES
const monthlyPartTime = {
  id: "monthlyPartTime",
  name: "Mensual Media Jornada",
  totalDays: 30,
  hoursPerDay: 4,
  price: 100,
};
const monthlyFullTime = {
  id: "monthlyFullTime",
  name: "Mensual Jornada Completa",
  totalDays: 30,
  hoursPerDay: 8,
  price: 200,
};
const tenDayPartTime = {
  id: "tenDayPartTime",
  name: "10 dias Media Jornada",
  totalDays: 10,
  hoursPerDay: 4,
  price: 20,
};
const tenDayFullTime = {
  id: "tenDayFullTime",
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

// PASSESOWNED: Create inactive passed
function fakePassesOwnedBuilder({
  numberOfPasses = 1,
  isExpired = false,
  isUsed = false,
} = {}) {
  const passesOwned = [];

  for (let i = 0; i < numberOfPasses; i++) {
    const purchaseDate = isExpired
      ? faker.date.past({ years: 1 })
      : faker.date.recent();
    const passType = passes[Math.floor(Math.random() * passes.length)];

    passesOwned.push({
      id: faker.string.numeric(24),
      pass: passType,
      daysUsed: isUsed
        ? passType.totalDays
        : faker.number.int(passType.totalDays),
      startDate: purchaseDate,
      expirationDate: DateTime.fromISO(purchaseDate.toISOString())
        .plus({ days: 30 })
        .toJSDate(),
      isActive: isExpired || isUsed ? false : true,
    });
  }
  return passesOwned;
}

// OWNERS
function fakeOwnerBuilder(numberOfOwners) {
  let owners = [];
  for (let i = 0; i < numberOfOwners; i++) {
    owners.push({
      id: faker.string.numeric(24),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: [faker.phone.number()],
      dni:
        faker.string.numeric(8) +
        faker.string.alpha({ casing: "upper", length: 1 }),
    });
  }
  return owners;
}

// DOGS
function fakeDogBuilder({
  numberOfDogs = 1,
  numberOfUsedPasses = 0,
  numberOfActivePasses = 0,
  numberOfOwners = 1,
} = {}) {
  const dogs = [];
  const owners = fakeOwnerBuilder(numberOfOwners);
  const usedPasses = fakePassesOwnedBuilder({
    numberOfPasses: numberOfUsedPasses,
    isExpired: true,
  });
  const activePasses = fakePassesOwnedBuilder({
    numberOfPasses: numberOfActivePasses,
  });

  for (let i = 0; i < numberOfDogs; i++) {
    const dateOfBirth = faker.date.birthdate({
      min: 2010,
      max: 2022,
      mode: "year",
    });
    const recentDate = faker.date.recent();
    const fixed = faker.datatype.boolean();

    dogs.push({
      id: faker.string.numeric(24),
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
      owners,
      passes: [...usedPasses, ...activePasses],
    });
  }
  return dogs;
}
module.exports = { fakeDogBuilder };
