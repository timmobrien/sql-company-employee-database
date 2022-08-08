// view all departments

const { connect } = require("../db/connection")


// Accepts name and queries to add new department
async function addDepartment(name) {

    const db = await connect();

    await db.query('INSERT INTO `company_db`.`departments` (`name`) VALUES (?)', name);
    
}

// Gets the current list of departments and returns it
async function getDepartments() {
    const db = await connect();
    const [departments] = await db.query('SELECT * FROM departments');
    return departments;
}

// Delete department
async function deleteDepartment(departmentID) {

    const db = await connect();
  
    const deleteQuery = "DELETE FROM `company_db`.`departments` WHERE id = ?";
  
    await db.query(deleteQuery, departmentID);
}

// Export the functions for use in main file
module.exports = {
    addDepartment,
    getDepartments,
    deleteDepartment
}