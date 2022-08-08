// Importing files & packages

const inquirer = require("inquirer");
const { getDepartments, addDepartment, deleteDepartment } = require("./operations/department");
const { addEmployee, getEmployees, updateEmployee, deleteEmployee} = require("./operations/employee");
const { getRoles, addRole, deleteRole } = require("./operations/role");
const cTable = require('console.table')

// Main function with initial prompts
function main() {
  inquirer
    .prompt([
      {
        message: "What would you like to do?",
        type: "list",
        name: "operations",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add department",
          "Add a role",
          "Add an employee",
          "Edit an employee",
          "Delete an entry",
          "Exit application",
        ],
      },
    ])
    // Case for each answer
    .then(async (ans) => {
      switch (ans.operations) {
        case "View all departments":
          // Calls the function to get specified data & display it in a table
          console.table(await getDepartments());
          main();
          break;
        
        case "View all employees":
          console.table(await getEmployees());
          main();
          break;
        
        case "View all roles":
          console.table(await getRoles());
          main();
          break;
        // Calls functions with further prompts
        case "Add department":
          newDepartment();
          break;

        case "Add an employee":
          newEmployee();
          break;


        case "Add a role":
          newRole();
          break;

        case "Edit an employee":
          editEmployee();
          break;
        case "Delete an entry":
          deleteEntry();
          break;
        case "Exit application":
          process.exit(0);
      }
    });
}

// Prompts to create a new department
function newDepartment() {
  inquirer
    .prompt([
      {
        message: "What is the department name?",
        type: "input",
        name: "department_name",
      },
    ])
    // Once the inputs are complete, call the add department function & pass the necessary data
    .then(async (ans) => {
      await addDepartment(ans.department_name);
      console.table(await getDepartments());
      main();
    });
}

// Prompts to create new role 
async function newRole() {
  // Get the departments data to choose from
  const departmentsData = await getDepartments();
  // Array that inquirer will use for listing
  const departmentChoices = [];
  // For each item in the departments array, create an object that inquirer will accept
  departmentsData.forEach((dep) => {
    let qObj = {
      name: dep.name,
      value: dep.id,
    };
    // Push each object into the choices array
    departmentChoices.push(qObj);
  });

  inquirer
    .prompt([
      {
        message: "What is the title of the role?",
        type: "input",
        name: "title",
      },
      {
        message: "What is the salary associated with the role?",
        type: "number",
        name: "salary",
      },
      {
        message: "Which department does the role belong to?",
        type: "list",
        choices: departmentChoices,
        name: "department_id",
      },
    ])
    // Then pass the inputs to the addRole function, and display the updated role table
    .then(async (ans) => {
      await addRole(ans.title, ans.salary, ans.department_id);
      console.table(await getRoles());
      main();
    });
}

// Function to add a new employee
async function newEmployee() {

  // Get list of roles & make inquirer choices array
  const roles = await getRoles();
  const roleChoices = [];

  roles.forEach((role) => {
    let qObj = {
      name: role.title,
      value: role.id,
    };
    roleChoices.push(qObj);
  });

  // Current employee list so that a manager can be chosen
  const employees = await getEmployees();
  const managerChoices = [];

  employees.forEach((emp) => {
    let qObj = {
      name: emp.first_name + " " + emp.last_name,
      value: emp.id,
    };
    managerChoices.push(qObj);
  });

  inquirer
    .prompt([
      {
        message: "First name: ",
        type: "input",
        name: "first_name",
      },
      {
        message: "Last name: ",
        type: "input",
        name: "last_name",
      },
      {
        message: "Role: ",
        type: "list",
        name: "role_id",
        choices: roleChoices,
      },
      {
        message: "Does this employee have a manager?",
        type: "confirm",
        name: "manager",
      },
      {
        message: "Please select their manager",
        type: "list",
        name: "manager_id",
        choices: managerChoices,
        when: (ans) => ans.manager,
      },
    ])
    // Pass all the data to the add employee function & display the updated table
    .then(async (ans) => {
      await addEmployee(
        ans.first_name,
        ans.last_name,
        ans.role_id,
        ans.manager_id
      );
      console.table(await getEmployees());
      main();
    });
}

// Prompts to edit employees
async function editEmployee() {

  // Get & format list of employees for choices
  const employees = await getEmployees();
  const employeeChoices = [];

  employees.forEach((emp) => {
    let qObj = {
      name: emp.first_name + " " + emp.last_name,
      value: emp.id,
    };
    employeeChoices.push(qObj);
  });

  // Get roles & format for when user wants to change employee roles
  const roles = await getRoles();
  const roleChoices = [];

  roles.forEach((role) => {
    let qObj = {
      name: role.title,
      value: role.id,
    };
    roleChoices.push(qObj);
  });

  inquirer
    .prompt([
      {
        message: "Which employee would you like to edit?",
        name: "employee_id",
        type: "list",
        choices: employeeChoices,
      },
      {
        message: "What would you like to edit?",
        type: "list",
        choices: ["Name", "Manager", "Role"],
        name: "update_choice",
      },
      {
        message: "First name: ",
        type: "input",
        name: "first_name",
        when: (ans) => ans.update_choice === "Name",
      },
      {
        message: "Last name: ",
        type: "input",
        name: "last_name",
        when: (ans) => ans.update_choice === "Name",
      },
      {
        message: "New role: ",
        type: "list",
        name: "role_id",
        choices: roleChoices,
        when: (ans) => ans.update_choice === "Role",
      },
      {
        message: "New manager: ",
        type: "list",
        name: "manager_id",
        choices: employeeChoices,
        when: (ans) => ans.update_choice === "Manager",
      },
    ])
    // Then pass all answers to the update function
    // Any undefined criteria that the user did not update will be ignored by the function
    .then(async (ans) => {
      await updateEmployee(
        ans.first_name,
        ans.last_name,
        ans.role_id,
        ans.manager_id,
        ans.employee_id
      );
      console.table(await getEmployees());
      main();
    });
}

async function deleteEntry() {
  inquirer
    .prompt([
      {
        message: "What would you like to delete?",
        type: "list",
        name: "delete_choice",
        choices: [
          "Employee",
          "Role",
          "Department",
        ]
      }
    ])
    .then (async (ans) => {
      switch (ans.delete_choice) {
        case "Employee":
          removeEmployee();
          break;
        case "Role":
          removeRole();
          break;
        case "Department":
          removeDepartment();
          break;
      }
    })
}

async function removeEmployee() {
  const employees = await getEmployees();
  const employeeChoices = [];


  employees.forEach((emp) => {
    let qObj = {
      name: emp.first_name + " " + emp.last_name,
      value: emp.id,
    };
    employeeChoices.push(qObj);
  });

  inquirer
    .prompt([
      {
        message: "Which employee would you like to delete?",
        type: "list",
        name: "employee_id",
        choices: employeeChoices
      }
    ]).then(async (ans) => {
      await deleteEmployee(ans.employee_id);
      console.table(await getEmployees());
      main();
    })
}


async function removeDepartment() {
  const departments = await getDepartments();
  const departmentChoices = [];


  departments.forEach((dep) => {
    let qObj = {
      name: dep.name ,
      value: dep.id,
    };
    departmentChoices.push(qObj);
  });

  inquirer
    .prompt([
      {
        message: "Which department would you like to delete?",
        type: "list",
        name: "department_id",
        choices: departmentChoices
      }
    ]).then(async (ans) => {
      await deleteDepartment(ans.department_id);
      console.table(await getDepartments());
      main();
    })
}

async function removeRole() {
  const roles = await getRoles();
  const roleChoices = [];


  roles.forEach((role) => {
    let qObj = {
      name: role.title ,
      value: role.id,
    };
    roleChoices.push(qObj);
  });

  inquirer
    .prompt([
      {
        message: "Which role would you like to delete?",
        type: "list",
        name: "role_id",
        choices: roleChoices
      }
    ]).then(async (ans) => {
      await deleteRole(ans.role_id);
      console.table(await getRoles());
      main();
    })
}



// Run main function
main();
