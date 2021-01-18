const assert = require("assert");
const should = require("should");
let tested = require("../router");
describe("test", () => {
    it("test №1", () => {
        assert.equal(true, tested.test(9, 5));
        assert.equal(false, tested.test(500, 8000));
        assert.equal(false, tested.test(-988, 5));
        assert.equal(false, tested.test(-988, -1));
        assert.equal(false, tested.test(-988, 0));
        assert.equal(true, tested.test(988, 0));
    });
    it("test №2", () => {
        assert.equal(false, tested.test("-7", 1));
        assert.equal(true, tested.test(10, "-7"));
    });
    it("test №3", () => {
        assert.equal(false, tested.test("saddsaaf", 1));
        assert.equal(false, tested.test(10, "asfasddsffd"));
        assert.equal(false, tested.test(10, "asfas8"));
        assert.equal(true, tested.test(10, "8asfas"));
        assert.equal(false, tested.test(4, "8asfas789"));
    });
});
describe("var", () => {
    it("test №1", () => {
        parseInt(tested.lastIdArtInAuction).should.be.type('number');
        parseInt(tested.timeout).should.be.type('number');
        parseInt(tested.interval).should.be.type('number');
        parseInt(tested.pause).should.be.type('number');
    });
    it("test №2", () => {
        tested.config.should.have.property("paints");
        tested.config.should.have.property("partners");
        tested.config.should.have.property("config");
    });
});
