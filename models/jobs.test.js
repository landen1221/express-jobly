"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./jobs.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


/********************* create */

describe("create", function () {
    const newJob = {
        title: "new",
        salary: 100,
        equity: "0.05",
        company_handle: "c3"
    }
  
    test("works", async function () {
      let job = await Job.create(newJob);
      let jobs = await Job.findAll();
      expect(job.title).toEqual(newJob.title);
  
    });

    test("bad request with dupe", async function () {
        try {
          await Job.create(newJob);
          await Job.create(newJob);
        } catch (err) {
          expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/************************************** findAll */

describe("findAll", function () {
    test("works: no filter", async function () {
      let jobs = await Job.findAll();

    //   expect(jobs).toEqual([
    //     {
    //         title: "Salesman or Saleswoman",
    //         salary: 99999,
    //         equity: "0.075",
    //         company_handle: "c1"
    //     },
    //     {
    //         title: "Snow Shoveler",
    //         salary: 45000,
    //         equity: "0.0",
    //         company_handle: "c2"
    //     },
    //     {
    //         title: "Part Time Frozen Yogurt Chef",
    //         salary: 32000,
    //         equity: "0.075",
    //         company_handle: "c3"
    //     }
    //     ]);
    });
});