const { connect } = require("../db/connection");

async function getEmployees() {
  // use join statement to grab the managers name
  const db = await connect();
  const [employees] = await db.query("SELECT * FROM employees");
  return employees;
}

async function addEmployee(firstName, lastName, roleID, managerID) {
  const db = await connect();
  const inputs = [firstName, lastName, roleID, managerID];
  await db.query(
    "INSERT INTO `company_db`.`employees` (`first_name`, `last_name`, `role_id`,`manager_id`) VALUES (?,?,?,?)",
    inputs
  );
}

async function updateEmployee( firstName, lastName, roleID, managerID, EmployeeID) {
    const db = await connect();
    
    const nameChangeParam = [firstName, lastName, EmployeeID]
    const roleChangeParam = [roleID, EmployeeID];
    const managerChangeParam = [managerID, EmployeeID];
    console.log(nameChangeParam)

    const nameQueryString = "UPDATE employees SET `first_name` = ?, `last_name` = ? WHERE id = ?"
    const roleQueryString = "UPDATE employees SET `role_id` = ? WHERE id = ?";
    const managerQueryString = "UPDATE employees SET `manager_id` = ? WHERE id = ?"


    if (firstName) {
      await db.query(nameQueryString, nameChangeParam);
    };
    if (roleID) {
        await db.query (roleQueryString, roleChangeParam);
    };
    if(managerID) {
        await db.query (managerQueryString, managerChangeParam);
    }

}

module.exports = {
  getEmployees,
  addEmployee,
  updateEmployee
};
