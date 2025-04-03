import inquirer from 'inquirer';

// Import and require Pool (node-postgres)
import dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';

//import functions from queries file//
import { getDepartments, getRoles, getEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole } from './queries.js';

// A connection pool with your PostgreSQL credentials
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    database: process.env.DB_NAME,
    port: 5432,
});

const mainMenu = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ],
        },
    ])
        .then((answer) => {
            switch (answer.action) {
                case 'View all departments':
                    viewAllDepartments();
                    break;
                case 'View all roles':
                    viewAllRoles();
                    break;
                case 'View all employees':
                    viewAllEmployees();
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
                case 'Update an employee role':
                    updateEmployeeRole();
                    break;
                case 'Exit':
                    console.log('Goodbye!');
                    process.exit();
                    break;
                default:
                    console.log('Invalid choice');
                    mainMenu();
            }
        });
};ß

mainMenu();

export { mainMenu };