const inquirer = require("inquirer");
const { connect } = require("./db/connection");
const { getDepartments, addDepartment } = require("./operations/department");
const { addEmployee, getEmployees, updateEmployee } = require("./operations/employee");
const { getRoles, addRole } = require("./operations/role");


function main() {
  inquirer
    .prompt([
      {
        message: "What would you like to do?",
        type: "list",
        name: "operations",
        choices: [
          "View all departments",
          "Add department",
          "View all roles",
          "Add a role",
          "Add an employee",
          "Edit an employee",
          "Exit application",
        ],
      },
    ])
    .then(async (ans) => {
      switch (ans.operations) {
        case "View all departments":
          const departments = await getDepartments();
          console.table(departments);
          main();
          break;

        case "Add department":
          newDepartment();
          break;

        case "Add an employee":
          newEmployee();
          break;

        case "View all roles":
          const roles = await getRoles();
          console.table(roles);
          main();
          break;

        case "Add a role":
          newRole();
          break;
          
        case "Edit an employee":
          editEmployee();
          break;
        
        case "Exit application":
          process.exit(0);
      }
    });
}

function newDepartment() {
  inquirer
    .prompt([
      {
        message: "What is the department name?",
        type: "input",
        name: "department_name",
      },
    ])
    .then(async (ans) => {
      await addDepartment(ans.department_name);
      console.table(await getDepartments());
      main();
    });
}

async function newRole() {

  const departmentsData = await getDepartments();
  
  const departmentChoices = [];

  departmentsData.forEach(dep => {
    let qObj = {
      name: dep.name,
      value: dep.id
    }
    departmentChoices.push(qObj)
  })

  inquirer
    .prompt([
      {
        message: 'What is the title of the role?',
        type:'input',
        name:'title',
      },
      {
        message:"What is the salary associated with the role?",
        type: 'number',
        name: 'salary',
      },
      {
        message: 'Which department does the role belong to?',
        type: 'list',
        choices: departmentChoices,
        name:'department_id',
      }
    ])
    .then (async (ans)=>{
      await addRole(ans.title, ans.salary, ans.department_id);
      console.table(await getRoles());
      main();
    })
}

async function newEmployee() {

  // Get a list of roles to choose from
  const roles = await getRoles();

  const roleChoices = []

  roles.forEach(role => {
    let qObj = {
      name: role.title,
      value: role.id
    }
    roleChoices.push(qObj)
  })

  const employees = await getEmployees();
  const managerChoices = []

  employees.forEach(emp => {
    let qObj = {
      name: emp.first_name +" "+emp.last_name,
      value: emp.id
    }
    managerChoices.push(qObj)
  })

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
        name:"last_name"
      },
      {
        message: "Role: ",
        type: "list",
        name:"role_id",
        choices: roleChoices
      },
      {
        message: 'Does this employee have a manager?',
        type: "confirm",
        name: "manager",
      },
      {
        message: "Please select their manager",
        type: "list",
        name: "manager_id",
        choices: managerChoices,
        when: (ans) => ans.manager
      }
    ])
    .then(async (ans) => {
      await addEmployee(ans.first_name, ans.last_name, ans.role_id, ans.manager_id);
      console.table(await getEmployees());
      main();
  });
}


async function editEmployee () {

  const employees = await getEmployees();
  const employeeChoices = []

  employees.forEach(emp => {
    let qObj = {
      name: emp.first_name +" "+emp.last_name,
      value: emp.id
    }
    employeeChoices.push(qObj)
  })

  const roles = await getRoles();
  const roleChoices = []

  roles.forEach(role => {
    let qObj = {
      name: role.title,
      value: role.id
    }
    roleChoices.push(qObj)
  })


  inquirer
    .prompt([
      {
        message: "Which employee would you like to edit?",
        name: "employee_id",
        type: "list",
        choices: employeeChoices
      },
      {
        message: "What would you like to edit?",
        type: "list",
        choices: [
          "Name",
          "Manager",
          "Role",
        ],
        name: "update_choice",
      },
      {
        message: "First name: ",
        type: "input",
        name: "first_name",
        when: (ans) => ans.update_choice === "Name"
      },
      {
        message: "Last name: ",
        type: "input",
        name: "last_name",
        when: (ans) => ans.update_choice === "Name"
      },
      {
        message: "New role: ",
        type: "list",
        name: "role_id",
        choices: roleChoices,
        when: (ans) => ans.update_choice === "Role"
      },
      {
        message: "New manager: ",
        type: "list",
        name: "manager_id",
        choices: employeeChoices,
        when: (ans) => ans.update_choice === "Manager"
      }, 
  ]).then (async (ans)=> {
    await updateEmployee(ans.first_name, ans.last_name, ans.role_id, ans.manager_id, ans.employee_id)
    console.table(await getEmployees())
    main();
  })
}


main();
