CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email varchar(100) UNIQUE NOT NULL,
    salary INT NOT NULL,
    department varchar(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO employees (name, email, salary, department) VALUES
('rimi', 'rimi.dev@gmail.com', 50000, 'IT'),
('ruma', 'ruma.@gmail.com', 65000, 'IT'),
('mitu', 'mitu.@gmail.com', 920000, 'HR'),
('mimi', 'mimi@gmail.com', 22000, 'HR'),
('rafi', 'rafi.dev@gmail.com', 43000, 'IT'),
('tuli', 'tuli.@gmail.com', 48000, 'Design');

SELECT * FROM employees;


SELECT name, salary FROM employees;


select * from employees where salary>40000;


SELECT * FROM employees ORDER BY salary DESC; 

SELECT * FROM employees ORDER BY salary DESC LIMIT 3;

UPDATE employees SET salary = 21500 where name= 'rimi';

DELETE FROM employees WHERE name = 'tuli';

SELECT * FROM employees WHERE salary BETWEEN 30000 AND 50000;

SELECT * FROM employees WHERE department IN ('IT', 'HR');

SELECT COUNT(*) FROM employees;

SELECT AVG(salary) FROM employees;

SELECT department, COUNT(*) FROM employees GROUP BY department;

SELECT department, COUNT(*) FROM employees GROUP BY department HAVING COUNT(*) > 2;

CREATE TABLE users (
id SERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
status VARCHAR(20) DEFAULT 'active',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email) VALUES
('rimi', 'rimi.dev@gmail.com'),
('ruma', 'ruma.@gmail.com'),
('tuli', 'tuli.@gmail.com');

CREATE TABLE orders(
    id SERIAL PRIMARY KEY,
    user_id INT,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO orders (user_id, quantity) VALUES
(1, 5);

select users.name, orders.quantity from users
INNER JOIN orders ON users.id = orders.user_id;