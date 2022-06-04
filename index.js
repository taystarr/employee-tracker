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
                // function here
                break;

            case 'View all roles':
                // function here
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

promptUser();