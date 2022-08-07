const { faker } = require("@faker-js/faker");
const { addDepartment } = require("../../operations/department");
const { addEmployee } = require("../../operations/employee");
const { addRole } = require("../../operations/role");
const { connect } = require("../connection");

function randomID(arr) {
    var random_index = Math.floor(Math.random() * arr.length)
    var id = arr[random_index].id;
    return id;
}

async function seedDepartments(num = 10) {
  for (let index = 0; index < num; index++) {
    await addDepartment(faker.commerce.department());
  }
}

async function seedRoles(num = 10) {
  const db = await connect();

  const department_ids = await db.query(
    "SELECT id FROM `company_db`.`departments`;"
  );

  for (let index = 0; index < num; index++) {
    const department_id = randomID(department_ids[0]);
    const title = faker.name.jobTitle();
    const salary = faker.commerce.price((min = 50000), (max = 200000));
    await addRole(title, salary, department_id);
  }
}


async function seedEmployees(num = 10) {    
    const db = await connect();

    const roleIDs = await db.query(
        "SELECT id FROM `company_db`.`roles`;"
    );


    for (let index = 0; index < num; index++) {
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        const roleID = randomID(roleIDs[0]);
        const managerID = 3;

        await addEmployee(firstName, lastName, roleID, managerID);
    }
}

async function main() {
  await seedDepartments();
  await seedRoles();
  await seedEmployees();
}

main();

