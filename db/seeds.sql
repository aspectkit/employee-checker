INSERT INTO departments (name)
VALUES ("Law"),
("IT");

INSERT INTO roles(title, salary, department_id)
VALUES ("Senior Partner", 200000, 1),
("Head of IT", 100000, 2),
("Junior Partner", 80000, 1),
("Chief Operating Officer", 80000, 1),
("Senior Associate", 70000, 1),
("Junior Associate", 50000, 1);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES ("Jessica", "Pearson", 1, NULL),
("Harvey", "Specter", 1, NULL),
("Louis", "Litt", 1, NULL),
("Benjamin", "Zuckerberg", 2, NULL),
("Mike", "Ross", 3, 2),
("Donna", "Paulsen", 4, 1),
("Katrina", "Bennett", 5, 3),
("Brian", "Altman", 6, 7),
("Rachel", "Zane", 6, 7);
