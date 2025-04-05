import inquirer from 'inquirer';

// Import and require Pool (node-postgres)
import dotenv from 'dotenv';
dotenv.config();


//import functions from queries file//
import { viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole, updateManager } from './queries.js';  

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
                'Update an employee\'s manager',
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
                case 'Update an employee\'s manager':
                    updateManager();
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
};

mainMenu();

export { mainMenu };