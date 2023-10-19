const { fakeDogBuilder } = require("@test/builders");
const { query, mutate, gql } = require("@test/test-server");
const model = require("@db/models");

jest.mock("@db/models");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("dog model", () => {
  const [fakeDog] = fakeDogBuilder({
    numberOfDogs: 1,
    numberOfUsedPasses: 1,
    numberOfActivePasses: 1,
    numberOfOwners: 2,
  });

  test("check for UsedPasses", async () => {
    const [fakeDogUsedPass] = fakeDog.passes.filter((pass) => !pass.isActive);
    const dogsUsedPassesQuery = gql`
      query DogsUsedPassed {
        dogs {
          id
          name
          passes(isActive: false) {
            daysUsed
            expirationDate
            isActive
          }
        }
      }
    `;
    model.dog.find.mockReturnValueOnce();
    const { data, errors } = await query({
      query: dogsUsedPassesQuery,
    });
    console.log(errors);
    expect(model.dog.find).toHaveBeenCalledTimes(1);
    expect(model.dog.find).toHaveBeenCalledWith({ isActive: true });
    expect(data.dogs).toEqual([
      {
        id: fakeDog.id,
        name: fakeDog.name,
        usedPasses: [
          {
            daysUsed: fakeDogUsedPass.daysUsed,
            expirationDate: fakeDogUsedPass.expirationDate,
            isActive: false,
          },
        ],
      },
    ]);
  });
  test("check for ActivePasses", async () => {
    const [fakeDogUsedPass] = fakeDog.passes.filter((pass) => pass.isActive);
    const dogsUsedPassesQuery = gql`
      query DogsUsedPassed {
        dogs {
          id
          name
          passes(isActive: true) {
            daysUsed
            expirationDate
            isActive
          }
        }
      }
    `;
    model.dog.find.mockReturnValueOnce([fakeDog]);
    model.passOwned.find.mockReturnValueOnce([fakeDogUsedPass]);

    const { data } = await query({
      query: dogsUsedPassesQuery,
    });

    expect(model.dog.find).toHaveBeenCalledTimes(1);
    expect(model.dog.find).toHaveBeenCalledWith({ isActive: true });
    expect(data.dogs).toEqual([
      {
        id: fakeDog.id,
        name: fakeDog.name,
        activePasses: [
          {
            daysUsed: fakeDogUsedPass.daysUsed,
            expirationDate: fakeDogUsedPass.expirationDate,
            isActive: true,
          },
        ],
      },
    ]);
  });
});
