module.exports = {
  rules: {
    "no-console": "off",
    "import/no-cycle": "off",
    "import/no-extraneous-dependencies": "off",
    "babel/new-cap": "off",
    "require-await": "warn",
  },
  overrides: [
    {
      files: ["**/__tests__/**"],
      rules: {
        "jest/prefer-todo": "off",
      },
    },
  ],
};
