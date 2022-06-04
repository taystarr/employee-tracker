const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');

const promptUser = () => {

    console.log(
        `
        ---------------------------
        Welcome to Employee Tracker
        ---------------------------
        `
    );

    return inquirer.prompt({
        type: 'list',
        name: 'start',
        message: 'Please select from one of the following choices.',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update employee role',
            'Exit Employee Tracker'
        ]
    })
    .then((choice) => {
        switch (choice.start) {
            case 'View all departments':
                viewDepartments();
                break;

            case 'View all roles':
                viewRoles();
                break;

            case 'View all employees':
                // function here
                break;

            case 'Add a department':
                // function here
                break;

            case 'Add a role':
                // function here
                break;

            case 'Add an employee':
                // function here
                break;  
                
            case 'Update employee role':
                // function here
                break;    

            case 'Exit Employee Tracker':
                db.end();

        };
    });
};

const viewDepartments = () => {
    const sql = `SELECT name AS Departments FROM department`;

    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        promptUser();
    });
};

const viewRoles = () => {
    db.query(`SELECT title AS Title, 
            department.name AS Department, 
            salary AS Salary 
            FROM role 
            INNER JOIN department 
            ON role.department_id = department.id
           `, 
            (err, res) => {
              if (err) throw err;
              console.table(res);
              // return to role section
              promptUser();
    });
};

promptUser();