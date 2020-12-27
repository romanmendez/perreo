const { build, fake } = require("@jackfranklin/test-data-bot");
const { AttendanceModel } = require("../../src/components/attendance");
const { OwnerModel } = require("../../src/components/owner");
const { DogModel } = require("../../src/components/dog");
const { over } = require("lodash");

const mockingoose = {
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  updateOne: jest.fn(),
};

function ModelBuilder({ overrides } = {}) {
  return {
    _id: fake((f) => f.random.uuid()),
    ...overrides,
    updateOne: jest.fn(),
    populate: jest.fn(),
  };
}
const attendanceBuilder = (overrides) => ModelBuilder(overrides);
const ownerBuilder = (overrides) => ModelBuilder(overrides);
const dogBuilder = (overrides) => ModelBuilder(overrides);

const parentBuilder = build("parent", {
  fields: {
    id: fake((f) => f.random.uuid()),
  },
});
const contextBuilder = build("context", {
  fields: {
    model: {
      attendance: mockingoose,
      owner: mockingoose,
      dog: mockingoose,
      owner: mockingoose,
      pass: mockingoose,
      user: mockingoose,
    },
  },
});

module.exports = {
  parentBuilder,
  contextBuilder,
  attendanceBuilder,
  ownerBuilder,
  dogBuilder,
};
