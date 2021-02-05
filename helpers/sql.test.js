const { sqlForPartialUpdate } = require("./sql");

describe("test sqlForPartialUpdate function", function () {
  test("works: ", function () {
    const dataToUpdate = {firstName: 'Aliya', lastName: 'Hunter'}
    const jsToSql = { firstName: "first_name", lastName: "last_name", isAdmin: "is_admin", }
    const partialSQL = sqlForPartialUpdate(dataToUpdate, jsToSql);

    expect(partialSQL.setCols).toEqual('"first_name"=$1, "last_name"=$2');
    expect(partialSQL.values).toEqual([dataToUpdate.firstName, dataToUpdate.lastName]);
  });

  
});