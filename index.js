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
                addEmployee();
                break;  
                
            case 'Update employee role':
                updateEmployee();
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
        // return to start screen
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
            // return to view updated departments
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
              // return to start screen
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
                // return to view updated roles
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
                // return to start screen
                promptUser();
    });
};

const addEmployee = () => {
    let managers = ['None'];
    let allManagers = [];
    let roles = [];

    // loop through roles to push title options
    let addRole = `SELECT title FROM role`;
    db.query(addRole, (err, res) => {
        for (var i = 0; i < res.length; i++) {
            roles.push(res[i].title)
        }
    });

    // loop through managers to push full_name options
    let addManager = `SELECT id, CONCAT(first_name, " ", last_name) AS full_name
    FROM employee WHERE manager_id is NULL`;
    db.query(addManager, (err, res) => {
        for (var i = 0; i < res.length; i++) {
            managers.push(res[i].full_name);
            allManagers.push(res[i]);
        }
    });

    // first name, last name, role, manager
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is the new employee's first name?",
            validate: addFirst => {
                if (addFirst) {
                    return true;
                } else {
                    console.log("Please enter the employee's first name");
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the new employee's last name?",
            validate: addLast => {
                if (addLast) {
                    return true;
                } else {
                    console.log("Please enter the employee's last name");
                    return false;
                }
            }
        },
        {
            type: 'list',
            name: 'empRole',
            message: "What is the new employee's role?",
            choices: roles
        },
        {
            type: 'list',
            name: 'empManager',
            message: "Who is this employee's new manager?",
            choices: managers
        }
    ])
    .then((answers) => {
        allManagers.forEach((manager) => {
            if (manager.full_name === answers.empManager) {
                answers.empManager = manager.id;
            } else if (answers.empManager === 'None') {
                answers.empManager = null;
            }
        });

        db.query(`SELECT id FROM role WHERE title = '${answers.empRole}'`,
        (err, res) => {
            if (err) throw err;
            let roleId = res[0].id;

            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
            [
                answers.firstName,
                answers.lastName,
                roleId,
                answers.empManager
            ],
            (err, res) => {
                if (err) throw err;
                console.log(`Employee added`);
                // return to view employees
                viewEmployees();
            });
        });
    });
};

const updateEmployee = () => {
    let empName = [];
    let allEmps = [];
    let roleTitle = [];
    let allRoles = [];

    const getEmp = `SELECT id, CONCAT(first_name, " ", last_name) AS full_name FROM employee`;
    db.query(getEmp, (err, res) => {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            empName.push(res[i].full_name);
            allEmps.push(res[i]);
        }
        db.query(`SELECT id, title FROM role`, (err, res) => {
            for (var i = 0; i < res.length; i++) {
                roleTitle.push(res[i].title);
                allRoles.push(res[i]);
            }
        });

        return inquirer.prompt([
            {
                type: 'list',
                name: 'empName',
                message: "Which employee's role would you like to update?",
                choices: empName
            },
            {
                type: 'list',
                name: 'roleTitle',
                message: "What is this employee's new role?",
                choices: roleTitle
            }
        ])
        .then((answers) => {
            allEmps.forEach((employee) => {
                if (employee.full_name === answers.empName) {
                    answers.empName = employee.id;
                }
            });
            allRoles.forEach((role) => {
                if (role.title === answers.roleTitle) {
                    answers.roleTitle = role.id;
                }
            });

            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
            db.query(sql,
                [
                    answers.roleTitle,
                    answers.empName
                ],
                (err, res) => {
                    if (err) throw err;
                    console.log(`Employee role has been updated`);
                    // return to view updated employee
                    viewEmployees();
                });
        });
    });
};

promptUser();