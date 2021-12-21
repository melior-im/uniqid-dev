const chai = require("chai");
const request = require("supertest");
const httpStatus = require("http-status");

const app = require("../express");

const expect = chai.expect;

describe("Status endpoint", () => {
  it("should return OK", (done) => {
    request(app)
      .get("/status")
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("OK");
        return done();
      })
      .catch(done);
  });
});
