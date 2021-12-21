const chai = require("chai");
const request = require("supertest");
const httpStatus = require("http-status");

const app = require("../express");

const expect = chai.expect;

describe("API endpoints", () => {
  describe("single uniqid", () => {
    it("should generate one uniqid with default params", (done) => {
      request(app)
        .get("/api")
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.text).to.be.a("string");
          expect(res.text.includes(","), "Has comma").to.be.false;
          return done();
        })
        .catch(done);
    });

    it("should generate one uniqid with default params. Format: CSV", (done) => {
      request(app)
        .get("/api")
        .set("Accept", "text/csv")
        .expect(httpStatus.OK)
        .expect("Content-Type", "text/csv; charset=utf-8")
        .then((res) => {
          expect(res.text).to.be.a("string");
          expect(res.text.includes(","), "Has comma").to.be.false;
          return done();
        })
        .catch(done);
    });

    it("should generate one uniqid with default params. Format: JSON", (done) => {
      request(app)
        .get("/api")
        .set("Accept", "application/json")
        .expect(httpStatus.OK)
        .expect("Content-Type", "application/json; charset=utf-8")
        .then((res) => {
          expect(res.body).to.be.an("array");
          expect(res.body.length).to.equal(1);
          return done();
        })
        .catch(done);
    });

    it("should generate one uniqid with prefix", (done) => {
      const prefix = "test_";
      request(app)
        .get("/api")
        .query({ prefix })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.text).to.be.a("string");
          expect(res.text.includes(","), "Has comma").to.be.false;
          expect(res.text.startsWith(prefix)).to.be.true;
          return done();
        })
        .catch(done);
    });

    it("should generate one uniqid with suffix", (done) => {
      const suffix = "_test";
      request(app)
        .get("/api")
        .query({ suffix })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.text).to.be.a("string");
          expect(res.text.includes(","), "Has comma").to.be.false;
          expect(res.text.endsWith(suffix)).to.be.true;
          return done();
        })
        .catch(done);
    });

    it("should generate one uniqid with mode: time", (done) => {
      const mode = "time";
      request(app)
        .get("/api")
        .query({ mode })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.text).to.be.a("string");
          expect(res.text.includes(","), "Has comma").to.be.false;
          expect(res.text.length).to.equal(8);
          return done();
        })
        .catch(done);
    });

    it("should generate one uniqid with mode: process", (done) => {
      const mode = "process";
      request(app)
        .get("/api")
        .query({ mode })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.text).to.be.a("string");
          expect(res.text.includes(","), "Has comma").to.be.false;
          expect(res.text.length).to.equal(12);
          return done();
        })
        .catch(done);
    });
  });

  describe("multiple IDs", () => {
    it("should generate multiple uniqids with default params", (done) => {
      const count = 200;
      request(app)
        .get("/api")
        .query({ count })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.text).to.be.a("string");
          expect(res.text.includes("\n"), "Has newline").to.be.true;
          const entries = res.text.split("\n");
          expect(entries.length).to.equal(count);
          return done();
        })
        .catch(done);
    });

    // TODO: more formats
  });

  describe("param validation", () => {
    it("should reject invalid count (low)", (done) => {
      request(app)
        .get("/api")
        .query({ count: 0 })
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("Validation Failed");
          return done();
        })
        .catch(done);
    });
    it("should reject invalid count (high)", (done) => {
      request(app)
        .get("/api")
        .query({ count: 1000 })
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("Validation Failed");
          return done();
        })
        .catch(done);
    });

    it("should reject invalid count (not a number)", (done) => {
      request(app)
        .get("/api")
        .query({ count: "not a number" })
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("Validation Failed");
          return done();
        })
        .catch(done);
    });

    // TODO: more checks
  });
});
