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
                addRole();
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
            message: 'Please enter a department to add.',
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

const addRole = () => {
    let departments = [];

    const depChoose = `SELECT name FROM department`;
    db.query(depChoose, (err, res) => {
        for (var i = 0; i < res.length; i++) {
            departments.push(res[i]);
        }
    });

    return inquirer.prompt([
        {
            type: 'input',
            name: 'roleAdd',
            message: 'What role would you like to add?',
            validate: roleAdd => {
                if (roleAdd) {
                    return true;
                } else {
                    console.log('Please enter new role');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'salaryAdd',
            message: 'What is the salary for this role?',
            validate: addSalary => {
                if (isNaN(addSalary)) {
                    return 'Please enter a salary for this role';
                } else {
                    return true;
                }
            }
        },
        {
            type: 'list',
            name: 'dept',
            message: 'Which department does this role belong to?',
            choices: departments
        }
    ])
    .then(answer => {
        let depName = answer.dept;
        let selectDepId = `SELECT id FROM department WHERE name = '${depName}'`;

        db.query(selectDepId, (err, res) => {
            let depId = res[0].id;
            if (err) throw err;

            db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,
            [
                answer.roleAdd,
                answer.salaryAdd,
                depId
            ],
            (err, res) => {
                if (err) throw err;
                console.log(`New role created`);
                viewRoles();
            }
            )
        });
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