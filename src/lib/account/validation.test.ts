import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ageOn, maxDob, validateDob, validateUsername, validatePassword, validateEmail } from "./validation.ts";

const today = new Date(Date.UTC(2026, 10, 21));

describe("age check", () => {
  it("computes age around birthdays", () => {
    assert.equal(ageOn("2008-11-21", today), 18);
    assert.equal(ageOn("2008-11-22", today), 17);
    assert.equal(ageOn("1990-01-01", today), 36);
  });
  it("rejects under-18 and invalid dates", () => {
    assert.equal(validateDob("2008-11-21", today), null);
    assert.match(validateDob("2008-11-22", today) ?? "", /18 or older/);
    assert.match(validateDob("2001-02-30", today) ?? "", /real date/);
    assert.match(validateDob("", today) ?? "", /date of birth/);
  });
  it("max DOB is exactly 18 years ago", () => {
    assert.equal(maxDob(today), "2008-11-21");
  });
});

describe("fields", () => {
  it("usernames", () => {
    assert.equal(validateUsername("Marco.Noir"), null);
    assert.ok(validateUsername("ab"));
    assert.ok(validateUsername("admin"));
    assert.ok(validateUsername("bad name"));
    assert.ok(validateUsername("a..b"));
  });
  it("passwords and email", () => {
    assert.ok(validatePassword("short1"));
    assert.ok(validatePassword("longpassword"));
    assert.equal(validatePassword("longpassw0rd"), null);
    assert.equal(validateEmail("a@b.co"), null);
    assert.ok(validateEmail("nope"));
  });
});
