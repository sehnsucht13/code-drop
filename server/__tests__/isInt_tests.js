const { isInt } = require("../Controllers/helpers");

describe("isInt tests", () => {
  it("should return false when parsing non-integers", () => {
    expect(isInt("abc")).toBe(false);
    expect(isInt("1abc")).toBe(false);
    expect(isInt("a23bc")).toBe(false);
    expect(isInt("1.2")).toBe(false);
    expect(isInt("1.2abc")).toBe(false);
  });

  it("should return true when parsing integers", () => {
    expect(isInt("1")).toBe(true);
    expect(isInt("123")).toBe(true);
    expect(isInt("4442312")).toBe(true);
    expect(isInt("0")).toBe(true);
  });
  it("should return false when parsing integers", () => {
    expect(isInt("-1")).toBe(false);
    expect(isInt("-1231")).toBe(false);
  });
});
