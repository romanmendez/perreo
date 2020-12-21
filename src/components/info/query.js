const InfoQueryType = `
  info: String!
`;

const InfoQueryResolver = {
  info: () => {
    return "Bienvenido a la Guaurderia";
  },
};

module.exports = { InfoQueryType, InfoQueryResolver };
