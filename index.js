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
                viewEmployees();
                break;

            case 'Add a department':
                addDepartment();
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
                console.log(
                    `
                    ------------------------------------
                    Thank you for using Employee Tracker
                    ------------------------------------
                    `
                );
                db.end();

        };
    });
};

const viewDepartments = () => {
    const sql = `SELECT id AS ID,
                name AS Departments FROM department`;

    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        promptUser();
    });
};

const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'depAdd',
            message: 'Please enter a new department to add.',
            validate: depAdd => {
                if (depAdd) {
                    return true;
                } else {
                    console.log('Please enter new department');
                    return false;
                }
            }
        }
    ])
    .then((answer) => {
        db.query(`INSERT INTO department SET ?`,
        { name: answer.depAdd },
        (err, res) => {
            if (err) throw err;
            console.log('Departments updated');
            viewDepartments();
        })
    });
};

const viewRoles = () => {
    db.query(`SELECT role.id AS ID,
            title AS Title, 
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

const viewEmployees = () => {
    db.query(`SELECT employee.id AS ID,
            CONCAT (employee.first_name, " ", employee.last_name) AS Name, 
            role.title AS Title, 
            department.name AS Department,
            role.salary as Salary, 
            CONCAT (manager.first_name, " ", manager.last_name) AS Manager
            FROM employee
            LEFT JOIN role ON employee.role_id = role.id
            LEFT JOIN department ON role.department_id = department.id
            LEFT JOIN employee manager ON employee.manager_id = manager.id
            `,
            (err, res) => {
                if (err) throw err;
                console.table(res);
                // return to role section
                promptUser();
    });
};

promptUser();