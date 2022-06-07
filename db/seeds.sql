SET FOREIGN_KEY_CHECKS=0;

INSERT INTO department (name)
VALUES
    ('Finance'),
    ('Marketing'),
    ('Human Resources'),
    ('IT');

INSERT INTO role (title, salary, department_id)
VALUES
    ('CPA', 90000, 1),
    ('Finance Officer', 140000, 1),
    ('Junior Marketing Associate', 55000, 2),
    ('Marketing Manager', 100000, 2),
    ('HR Associate', 85000, 3),
    ('HR Manager', 120000, 3),
    ('Software Engineer', 88000, 4),
    ('IT Manager', 140000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Wayne', 1, 2),
    ('Michael', 'Scott', 2, null),
    ('Matthew', 'Bargamin', 3, 4),
    ('Marcus', 'Lang', 4, null),
    ('Jonathan', 'Smith', 5, 6),
    ('Dwight', 'Schrute', 6, null),
    ('Taylor', 'Roberts', 7, 8),
    ('Charles', 'Darwin', 8, null);