const sub = require("date-fns/sub");
const { DogResolver } = require("../model");
const {
  parentBuilder,
  contextBuilder,
  attendanceBuilder,
  ownerBuilder,
} = require("utils/builders");
const { AttendanceModel } = require("../../attendance");

beforeEach(() => jest.resetAllMocks());

test(`DogResolver.attendances returns an array of attendances`, async () => {
  const parent = parentBuilder();
  const context = contextBuilder();
  const fakeAttendances = [
    attendanceBuilder({
      overrides: { dog: { _id: parent.id } },
    }),
    attendanceBuilder({
      overrides: { dog: { _id: parent.id } },
    }),
  ];
  context.model.attendance.find.mockResolvedValueOnce(fakeAttendances);
  const attendances = await DogResolver.attendances(parent, {}, context);

  expect(context.model.attendance.find).toHaveBeenCalledTimes(1);
  expect(context.model.attendance.find).toHaveBeenCalledWith({
    dog: { _id: parent.id },
  });
  expect(attendances).toEqual(fakeAttendances);

  context.model.attendance.find.mockResolvedValueOnce([]);
  const noAttendance = await DogResolver.attendances(parent, {}, context);

  expect(noAttendance).toEqual([]);
});

test(`DogResolver.owners returns an array of owners`, async () => {
  const parent = parentBuilder();
  const context = contextBuilder();
  const fakeOwners = [
    ownerBuilder({
      overrides: { dogs: { _id: parent.id } },
    }),
    ownerBuilder({
      overrides: { dogs: { _id: parent.id } },
    }),
  ];
  context.model.owner.find.mockResolvedValueOnce(fakeOwners);
  const owners = await DogResolver.owners(parent, {}, context);

  expect(context.model.owner.find).toHaveBeenCalledTimes(1);
  expect(context.model.owner.find).toHaveBeenCalledWith({
    dogs: { _id: parent.id },
  });
  expect(owners).toEqual(fakeOwners);

  context.model.owner.find.mockResolvedValueOnce([]);
  const noOwners = await DogResolver.owners(parent, {}, context);

  expect(noOwners).toEqual([]);
});

test(`DogResolver.lastAttendance returns the most recent attendance or null`, async () => {
  const parent = parentBuilder();
  const context = contextBuilder();
  const fakeAttendances = [
    attendanceBuilder({
      overrides: {
        dog: { _id: parent.id },
        start: sub(new Date(), { days: 5 }),
      },
    }),
    attendanceBuilder({
      overrides: {
        dog: { _id: parent.id },
        start: sub(new Date(), { days: 2 }),
      },
    }),
  ];

  context.model.attendance.find.mockResolvedValueOnce(fakeAttendances);
  const fakeLastAttendance = fakeAttendances[1];
  const lastAttendance = await DogResolver.lastAttendance(parent, {}, context);

  expect(lastAttendance).toEqual(fakeLastAttendance);

  context.model.attendance.find.mockResolvedValueOnce([]);
  const noAttendance = await DogResolver.lastAttendance(parent, {}, context);

  expect(noAttendance).toBe(null);
});
