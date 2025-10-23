import "@testing-library/jest-dom";

// Mock fetch for API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  })
);

// Mock TextEncoder/TextDecoder for react-router
global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;

// Mock localStorage
const storedValues = new Map();

const localStorageMock = {
  getItem: (key) => storedValues.get(key) || null,
  setItem: (key, value) => storedValues.set(key, value),
  removeItem: (key) => storedValues.delete(key),
  clear: () => storedValues.clear(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Reset storage before each test
beforeEach(() => {
  storedValues.clear();
  storedValues.set("isDarkMode", "false");
});
