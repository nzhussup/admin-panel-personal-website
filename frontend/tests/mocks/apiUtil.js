jest.mock("../utils/base/apiUtil", () => ({
  clearCache: jest.fn(() => Promise.resolve()),
}));
