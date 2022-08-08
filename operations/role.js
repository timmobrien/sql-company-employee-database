// import db connection
const { connect } = require("../db/connection");

// Get all roles
async function getRoles() {
  // use join statement to grab the managers name
  const db = await connect();
  const [roles] = await db.query("SELECT * FROM roles");
  return roles;
}

// Add new role 
async function addRole(title, salary, department_id) {
  const db = await connect();
  // Put inputs in array to protect from sql injection
  const inputs = [title, salary, department_id];
  // Query the db with the inputs
  await db.query(
    "INSERT INTO `company_db`.`roles` (`title`, `salary`, `department_id`) VALUES (?,?,?)",
    inputs
  );
}

// Delete a role
async function deleteRole(roleID) {

  const db = await connect();

  const deleteQuery = "DELETE FROM `company_db`.`roles` WHERE id = ?";

  await db.query(deleteQuery, roleID);
}

// Export functions for use in main file
module.exports = { addRole, getRoles , deleteRole };
