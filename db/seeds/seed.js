// Seeding file

const { faker } = require("@faker-js/faker");
const { addDepartment } = require("../../operations/department");
const { addEmployee, updateEmployee } = require("../../operations/employee");
const { addRole } = require("../../operations/role");
const { connect } = require("../connection");

// ----------------------------
const num = 10
// ----------------------------

// Creates random id's that are compatible with the foreign keys
function randomID(arr) {
  // ID can only be as large as the number of inputs in the referenced table
  var random_index = Math.floor(Math.random() * arr.length);
  var id = arr[random_index].id;
  return id;
}

// Use faker to input department names
async function seedDepartments() {
  for (let index = 0; index < num; index++) {
    await addDepartment(faker.commerce.department());
  }
}

// Inputs for roles table
async function seedRoles() {
  const db = await connect();

  const department_ids = await db.query(
    "SELECT id FROM `company_db`.`departments`;"
  );

  // Use faker to get role title, a random salary & a compatible department ID
  for (let index = 0; index < num; index++) {
    const department_id = randomID(department_ids[0]);
    const title = faker.name.jobTitle();
    const salary = faker.commerce.price((min = 50000), (max = 200000));
    await addRole(title, salary, department_id);
  }
}

// Inputs employee data
async function seedEmployees() {
  const db = await connect();

  const roleIDs = await db.query("SELECT id FROM `company_db`.`roles`;");

  // Faker gives fake names
  // Calls function to get compatible ID's
  for (let index = 0; index < num; index++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const roleID = randomID(roleIDs[0]);

    // Can't seed the manager ID's as they reference themselves, sets them to null instead
    const managerID = null;

    await addEmployee(firstName, lastName, roleID, managerID);
  }
}

// After the employee table has been made, we can go through and set random manager's
async function seedEmployeeManager() {
  const db = await connect();

  const managerData = await db.query("SELECT id FROM `company_db`.`employees`");

  // undefined variables to pass through to the update function so they will be ignored
  const firstName = undefined;
  const lastName = undefined;
  const roleID = undefined;

  // Loop through each employee

  for (let index = 0; index < managerData[0].length; index++) {
    const randomNumber = Math.floor(Math.random() * 3);
    const employeeID = index + 1;

    // 1 in 3 employees will have null for a manager
    if (randomNumber === 0) {
      const managerID = null;
      await updateEmployee(firstName, lastName, roleID, managerID, employeeID);
    } else {
      // the rest will be assigned a random manager
      // Not taking into account heirarchy structure for the seed data
      const managerID = randomID(managerData[0]);
      await updateEmployee(firstName, lastName, roleID, managerID, employeeID);
    }
  }
}

// Main function to run seed
async function main() {
  await seedDepartments();
  await seedRoles();
  await seedEmployees();
  await seedEmployeeManager();

}

main();
