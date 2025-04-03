import pool from './connection.js';
import inquirer from 'inquirer';
import { mainMenu } from './index.js'; // Import mainMenu

//function to view all departments
const viewAllDepartments = async () => {
    const res = await pool.query('SELECT * FROM department');
    console.table(res.rows);
    mainMenu();
}

//function to view all roles
const viewAllRoles = async () => {
    const res = await pool.query(`
        SELECT role.id, role.title, department.name AS department, role.salary 
        FROM role 
        JOIN department ON role.department_id = department.id
    `);
    console.table(res.rows);
    mainMenu();
}
//function to view all employees
const viewAllEmployees = async () => {
    const res = await pool.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, 
        department.name AS department, role.salary, 
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
FROM employee 
 JOIN role ON employee.role_id = role.id 
 JOIN department ON role.department_id = department.id 
 LEFT JOIN employee manager ON employee.manager_id = manager.id`);
    console.table(res.rows);
    mainMenu();
}


//function to add a department
//WHEN I choose to add a department THEN I am prompted to enter the name 
//"What is the name of the department?"
//and that department is added to the database
//"Added __ to the database"
const addDepartment = async () => {
//try to see if the department name already exists

    const { departmentName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'What is the name of the department?',
        },
    ]);

    await pool.query(
        'INSERT INTO department (name) VALUES ($1)', 
        [departmentName]);
    console.log(`Added ${departmentName} to the database`);
    mainMenu();
}

//function to add a role
//WHEN I choose to add a role
//THEN I am prompted to enter the name, salary, and department 
//"What is the name of the role?"
//"What is the salary of the role?"
//"which department does the role belong to?"(use arrow keys)
//then that role is added to the database
//"Added __ to the database"


//funtion to add an employee
//WHEN I choose to add an employee
//THEN I am prompted to enter the employee’s 
// first name, last name, role, and manager, 
//"What is the first name of the employee?"
//"What is the last name of the employee?"
//"What is the employees role?"(use arrow keys)
// and that employee is added to the database

//funtion to update an employee role
//WHEN I choose to update an employee role
//THEN I am prompted to select an employee to update 
// and their new role and this information is updated in the database
//"Which employee do you want to update?"(use arrow keys)
//"Which role do you want to assign the selected employee?"(use arrow keys)
