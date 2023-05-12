// const express = require('express');
const mysql = require('mysql2');
// const PORT = process.env.PORT || 3001;
// const app = express();
const inquirer = require('inquirer');

// app.use(express.urlencoded({ extended: false}));
// app.use(express.json()); 

require('dotenv').config();

const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'employees_db'
},
console.log(`Connected to the employees_db database`)
);

let employeesList = [];
db.query('SELECT first_name FROM employees', function (err, results){
    for (i of results){
        employeesList.push(i['first_name']);
    }
});


let roleList = [];
db.query('SELECT title FROM roles', function (err, results){
    for (i of results){
        roleList.push(i['title']);
    }
});

let departmentList = [];
db.query('SELECT name FROM departments', function (err, results){
    for (i of results){
        departmentList.push(i['name']);
    }
});



inquirer
.prompt([
    {
        type: 'list',
        message: "What do you wanna do?",
        name: 'action',
        choices: ['View Departments', 'View Roles', 'View Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role']
    },
    {
        type: 'input',
        name: 'departmentName',
        message: 'Department Name: ',
        when: (answers) => answers.action === 'Add Department'
    },
    {
        type: 'input',
        name: 'roleName',
        message: 'Role Name: ',
        when: (answers) => answers.action === 'Add Role'
    },
    {
        type: 'input',
        name: 'roleSalary',
        message: 'Role Salary: ',
        when: (answers) => answers.action === 'Add Role'
    },
    {
        type: 'list',
        name: 'roleDepartment',
        message: 'Role Department: ',
        choices: departmentList,
        when: (answers) => answers.action === 'Add Role'
    },
    {
        type: 'input',
        name: 'employeeFirstName',
        message: 'Employee First Name: ',
        when: (answers) => answers.action === 'Add Employee'
    },
    {
        type: 'input',
        name: 'employeeLastName',
        message: 'Employee Last Name: ',
        when: (answers) => answers.action === 'Add Employee'
    },
    {
        type: 'list',
        name: 'employeeRole',
        message: 'Employee Role: ',
        choices: roleList,
        when: (answers) => answers.action === 'Add Employee'
    },
    {
        type: 'list',
        name: 'employeeManager',
        message: 'Employee Manager: ',
        choices: employeesList,
        when: (answers) => answers.action === 'Add Employee'
    },
    {
        type: 'list',
        name: 'updateEmployee',
        message: 'Which Employee: ',
        choices: employeesList,
        when: (answers) => answers.action === 'Update Employee Role'
    },
    {
        type: 'list',
        name: 'updateEmployeeRole',
        message: 'Which Role: ',
        choices: roleList,
        when: (answers) => answers.action === 'Update Employee Role' 
    }
])
.then(function (response){
    if (response.action === 'View Departments'){
        viewDepartments(response);
    }
    else if (response.action === 'View Roles'){
        viewRoles(response);
    }
    else if (response.action === 'View Employees'){
        viewEmployees(response);
    }
    else if (response.action === 'Add Department'){
        addDepartment(response);
    }
    else if (response.action === 'Add Role'){
        addRole(response);
    }
    else if (response.action === 'Add Employee'){
        addEmployee(response);
    }
    else if (response.action === 'Update Employee Role'){
        updateEmployeeRole(response);
    }
});


function viewDepartments(){
    db.query('SELECT * FROM departments', function (err, results){
        console.table(results);
    });
}

function viewRoles(){
    db.query('SELECT * FROM roles', function (err, results){
        console.table(results);
    });
}

function viewEmployees(){
    db.query('SELECT * FROM employees', function (err, results){
        console.table(results);
    });
}

function updateEmployeeRole(response){
    let roleNum;
    db.query(`SELECT id FROM roles WHERE title = '${response.updateEmployeeRole}'`, function (err, results){
        roleNum = results[0]['id'];
        db.query(`UPDATE employees SET role_id = ${roleNum} WHERE first_name = '${response.updateEmployee}'`, function (err, results){
            console.log("Role Changed!");
            db.query('SELECT * FROM employees', function (err, results){
                console.table(results);
            });
        });
    });
}

function addDepartment(response){
    db.query(`INSERT INTO departments(name) VALUES ('${response.departmentName}')`, function (err, results){
        console.log("Department Added!")
        db.query('SELECT * FROM departments', function (err, results){
            console.table(results);
        });
    });
}

function addRole(response){
    let roleDepart;
    db.query(`SELECT id FROM departments WHERE name = '${response.roleDepartment}'`, function (err, results){
        roleDepart = results[0]['id'];
        db.query(`INSERT INTO roles(title, salary, department_id) VALUES ('${response.roleName}', ${response.roleSalary}, ${roleDepart})`, function(err, results){
            console.log("Role Added!");
            db.query('SELECT * FROM roles', function (err, results){
                console.table(results);
            });
        });
    });
}

function addEmployee(response){
    let employeeRoleID;
    let employeeManagerID;
    db.query(`SELECT id FROM roles WHERE title = '${response.employeeRole}'`, function (err, results){
        employeeRoleID = results[0]['id'];
        db.query(`SELECT id FROM employees WHERE first_name = '${response.employeeManager}'`, function (err, results){
            employeeManagerID = results[0]['id'];
            db.query(`INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES('${response.employeeFirstName}', '${response.employeeLastName}', ${employeeRoleID}, ${employeeManagerID})`, function (err, results){
                console.log("Employee Added!");
                db.query('SELECT * FROM employees', function (err, results){
                    console.table(results);
                });
            })
        });
    });
}

// app.use((req, res) => {
//     res.status(404).end();
// });

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });