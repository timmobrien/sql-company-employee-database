// view all departments

const { connect } = require("../db/connection")

// add department

async function addDepartment(name) {
    const db = await connect();

    await db.query('INSERT INTO `company_db`.`departments` (`name`) VALUES (?)', name);
    
}

async function getDepartments() {
    const db = await connect();
    const [departments] = await db.query('SELECT * FROM departments');
    return departments;
}

module.exports = {
    addDepartment,
    getDepartments
}