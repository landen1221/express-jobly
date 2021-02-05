"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

let jobTest;

/************************************** GET /jobs */

describe("GET /jobs", function () {
    test("ok for anon", async function () {
        const resp = await request(app).get("/jobs");
        jobTest = resp.body.jobs[0]

        expect(resp.statusCode).toBe(200)
        expect(resp.body.jobs.length).toEqual(3)
    });
});


/************************************** GET /jobs/:id */
describe ("GET /jobs/:id", function() {
    test("works for anon", async function () {
        const resp = await request(app).get(`/jobs/${jobTest.id}`);
        expect(resp.body.job.title).toEqual("Salesman or Saleswoman");
    })

    test("job id not found", async function () {
        const resp = await request(app).get(`/job/0`);
        expect(resp.statusCode).toEqual(404);
      });
})


/************************************** PATCH /jobs/:id */

describe("PATCH /jobs/:id", function () {
    test("works for users", async function () {
      const resp = await request(app)
        .patch(`/jobs/${jobTest.id}`)
        .send({title: "Salesperson"})
      expect(resp.body.job.title).toEqual('Salesperson');
    });
});


/************************************** DELETE /jobs/:id */
describe("DELETE /job/:id", function () {
    test("works for users", async function () {
        console.log(jobTest)
      const resp = await request(app).delete(`/jobs/${jobTest.id}`);
      expect(resp.body).toEqual({ deleted: `${jobTest.id}` });
    });
});

