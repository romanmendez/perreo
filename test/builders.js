const { fakerES: faker } = require("@faker-js/faker");

function fakeDogBuilder(numberOfDogs) {
  const dogsBuilt = [];
  for (let i = 0; i < numberOfDogs; i++) {
    const dateOfBirth = faker.date.birthdate({
      min: 2010,
      max: 2022,
      mode: "year",
    });
    const recentDate = faker.date.recent();
    const fixed = faker.datatype.boolean();

    dogsBuilt.push({
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
    });
  }
  return dogsBuilt;
}
module.exports = { fakeDogBuilder };
