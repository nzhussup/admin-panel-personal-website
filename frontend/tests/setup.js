import "@testing-library/jest-dom";

// Mock localStorage
const storedValues = new Map();

const localStorageMock = {
  getItem: (key) => storedValues.get(key) || null,
  setItem: (key, value) => storedValues.set(key, value),
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
