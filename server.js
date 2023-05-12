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
        type: 'input',
        name: 'roleDepartment',
        message: 'Role Department: ',
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
        type: 'input',
        name: 'employeeRole',
        message: 'Employee Role: ',
        when: (answers) => answers.action === 'Add Employee'
    },
    {
        type: 'input',
        name: 'employeeManager',
        message: 'Employee Manager: ',
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
            console.log("Role Changed!")
            db.query('SELECT * FROM employees', function (err, results){
                console.table(results);
            });
        });
    });
}

// app.use((req, res) => {
//     res.status(404).end();
// });

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });