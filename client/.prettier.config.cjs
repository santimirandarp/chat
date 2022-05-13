module.exports = {
  tabWidth: 4,
  semi: true,
  singleQuotes: true,
  bracketSpacing: true,
  arrowParens: "always",
  trailingComma: "es5",
  overrides: [
    {
      files: ["*.html"],
      options: { tabWidth: 2 },
    },
  ],
};
