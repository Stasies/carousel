export default {
  testEnvironment: "jsdom", // 👈 Simulates a browser environment
  transform: {
    "^.+\\.ts$": "babel-jest",
  },
};
