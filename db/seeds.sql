INSERT INTO department (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Marketing');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Sales Manager', 80000, 1),
    ('Sales Associate', 50000, 1),
    ('Software Engineer', 90000, 2),
    ('Data Analyst', 70000, 2),
    ('Accountant', 60000, 3),
    ('Marketing Specialist', 55000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES
        ('John', 'Doe', 1, NULL),
        ('Jane', 'Smith', 2, 1),
        ('Alice', 'Johnson', 3, NULL),
        ('Bob', 'Brown', 4, 3),
        ('Charlie', 'Davis', 5, NULL),
        ('Eve', 'Wilson', 6, 5);  