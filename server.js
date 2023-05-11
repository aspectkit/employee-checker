// const express = require('express');
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;
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
        ViewDepartments(response);
    }
    else if (response.action === 'View Roles'){
        ViewRoles(response);
    }
    else if (response.action === 'View Employees'){
        ViewEmployees(response);
    }
    else if (response.action === 'Add Department'){
        AddDepartment(response);
    }
    else if (response.action === 'Add Role'){
        AddRole(response);
    }
    else if (response.action === 'Add Employee'){
        AddEmployee(response);
    }
    else if (response.action === 'Update Employee Role'){
        UpdateEmployeeRole(response);
    }
});

// app.use((req, res) => {
//     res.status(404).end();
// });

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });