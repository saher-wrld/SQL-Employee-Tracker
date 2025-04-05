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
// //"Added __ to the database"

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
const addRole = async () => {
    const departments = await pool.query('SELECT * FROM department');
    const { roleName, salary, departmentId } = await inquirer.prompt([
        {
            type: 'input',
            name: 'roleName',
            message: 'What is the name of the role?',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role?',
        },
        {
            type: 'list', // Use 'list' to display department names as choices
            name: 'departmentId',
            message: 'Which department does the role belong to?',
            choices: departments.rows.map(department => ({
                name: department.name, // Display the department name
                value: department.id,  // Use the department ID as the value
            })),
            }
    ]);
    await pool.query(
        'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', 
        [roleName, salary, departmentId]);
    console.log(`Added ${roleName} to the database`);
    mainMenu();
}

//funtion to add an employee
//WHEN I choose to add an employee
//THEN I am prompted to enter the employee’s 
// first name, last name, role, and manager, 
//"What is the first name of the employee?"
//"What is the last name of the employee?"
//"What is the employees role?"(use arrow keys)
// and that employee is added to the database
//"Which employee is the manager?"(use arrow keys)
//"Added __ to the database"

const addEmployee = async () => {
    // Fetch roles and employees from the database
    const roles = await pool.query('SELECT * FROM role');
    const employees = await pool.query('SELECT * FROM employee');

    // Prompt the user for employee details
    const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the first name of the employee?',
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the last name of the employee?',
        },
        {
            type: 'list', // Use 'list' to display roles as choices
            name: 'roleId',
            message: 'What is the employee\'s role?',
            choices: roles.rows.map(role => ({
                name: role.title, // Display the role title
                value: role.id,   // Use the role ID as the value
            })),
        },
        {
            type: 'list', // Use 'list' to display employees as choices for the manager
            name: 'managerId',
            message: 'Who is the employee\'s manager?',
            choices: [
                { name: 'None', value: null }, // Option for no manager
                ...employees.rows.map(employee => ({
                    name: `${employee.first_name} ${employee.last_name}`, // Display full name
                    value: employee.id, // Use the employee ID as the value
                })),
            ],
        },
    ]);

    // Insert the new employee into the database
    await pool.query(
        'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
        [firstName, lastName, roleId, managerId]
    );

    console.log(`Added ${firstName} ${lastName} to the database`);
    mainMenu(); // Return to the main menu
};

//funtion to update an employee role
//WHEN I choose to update an employee role
//THEN I am prompted to select an employee to update 
// and their new role and this information is updated in the database
//"Which employee do you want to update?"(use arrow keys)
//"Which role do you want to assign the selected employee?"(use arrow keys)

const updateEmployeeRole = async () => {
    // Fetch employees and roles from the database
    const employees = await pool.query('SELECT * FROM employee');
    const roles = await pool.query('SELECT * FROM role');

    // Prompt the user for employee and role details
    const { employeeId, roleId } = await inquirer.prompt([
        {
            type: 'list', // Use 'list' to display employees as choices
            name: 'employeeId',
            message: 'Which employee do you want to update?',
            choices: employees.rows.map(employee => ({
                name: `${employee.first_name} ${employee.last_name}`, // Display full name
                value: employee.id, // Use the employee ID as the value
            })),
        },
        {
            type: 'list', // Use 'list' to display roles as choices
            name: 'roleId',
            message: 'Which role do you want to assign the selected employee?',
            choices: roles.rows.map(role => ({
                name: role.title, // Display the role title
                value: role.id,   // Use the role ID as the value
            })),
        },
    ]);

    // Update the employee's role in the database
    await pool.query(
        'UPDATE employee SET role_id = $1 WHERE id = $2',
        [roleId, employeeId]
    );

    console.log(`Updated employee's role in the database`);
    mainMenu(); // Return to the main menu
}

//* Application allows users to update employee managers (2 points).
const updateManager = async () => {
    // Fetch employees from the database
    const employees = await pool.query('SELECT * FROM employee');

    // Prompt the user for employee and manager details
    const { employeeId, managerId } = await inquirer.prompt([
        {
            type: 'list', // Use 'list' to display employees as choices
            name: 'employeeId',
            message: 'Which employee do you want to update?',
            choices: employees.rows.map(employee => ({
                name: `${employee.first_name} ${employee.last_name}`, // Display full name
                value: employee.id, // Use the employee ID as the value
            })),
        },
        {
            type: 'list', // Use 'list' to display employees as choices for the manager
            name: 'managerId',
            message: 'Who is the employee\'s new manager?',
            choices: [
                { name: 'None', value: null }, // Option for no manager
                ...employees.rows.map(employee => ({
                    name: `${employee.first_name} ${employee.last_name}`, // Display full name
                    value: employee.id, // Use the employee ID as the value
                })),
            ],
        },
    ]);

    // Update the employee's manager in the database
    await pool.query(
        'UPDATE employee SET manager_id = $1 WHERE id = $2',
        [managerId, employeeId]
    );

    console.log(`Updated employee's manager in the database`);
    mainMenu(); // Return to the main menu
}

//* Application allows users to view employees by manager (2 points).
//* Application allows users to view employees by department (2 points).


export { viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole, updateManager};
// export { viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole };