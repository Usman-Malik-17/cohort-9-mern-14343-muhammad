export default {
  testEnvironment: "jsdom",

  roots: ["<rootDir>/src"],

  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },

  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
};
