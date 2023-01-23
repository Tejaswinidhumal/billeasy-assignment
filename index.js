const express = require("express");

const app = express();
const Pool = require("pg").Pool;
const pool = new Pool({
 // PGPASSWORD=bhCbqKIJbiW5kAcYpYOI psql -h containers-us-west-44.railway.app -U postgres -p 6611 -d railway
 // postgresql://postgres:bhCbqKIJbiW5kAcYpYOI@containers-us-west-44.railway.app:6611/railway
    user: "postgres",
    host: "containers-us-west-44.railway.app",
    database: "railway",
    password: "bhCbqKIJbiW5kAcYpYOI",
    dialect: "postgres",
    port: 6611,
  });

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  client.query("SELECT NOW()", (err, result) => {
    release();
    if (err) {
      return console.error("Error executing query", err.stack);
    }
    console.log("Connected to Database !");
  });
});
app.get("/selectDept", (req, res, next) => {
  console.log("RESULT DATA :");
  pool.query("Select * from departments;").then((testData) => {
    console.log(testData.rows);
    res.send(testData.rows);
  });
});
app.get("/selectEmp", (req, res, next) => {
  console.log("RESULT DATA :");
  pool.query("Select * from employees;").then((testData) => {
    console.log(testData.rows);
    res.send(testData.rows);
  });
});

app.get("/showJoin", (req, res, next) => {
  console.log(req.query);
  pool.query(
      "Select EMP.id,EMP.name,EMP.department_id,DEPT.name as Dept_name,EMP.salary from employees as EMP INNER JOIN departments as DEPT ON EMP.department_id=DEPT.id order by DEPT.id;"
    )
    .then((testData) => {
      res.send(testData.rows);
    });
});
// 101 - Technical, 102 - Sales,103 - HR
app.get("/insertDept", (req, res, next) => {
  pool.query(
      "INSERT INTO departments (id,name,employee_count) VALUES (103,'HR',3)"
    )
    .then((testData) => {
      console.log(testData);
      res.send("Output: Inserted in departments table");
    })
    .catch((e) => {
      console.log(
        "All departments for billeasy are created! Check by running the select query :) 😊"
      );
      res.send(
        "All departments for billeasy are created! Check by running the select query :) 😊"
      );
    });
});

app.get("/insertEmp", (req, res, next) => {
  pool.query(
      "INSERT INTO employees (id,name,department_id,salary) VALUES (11,'tejaswini',201,999990)"
    )
    .then((testData) => {
      res.send(
        "Output: Inserted in employees table. Run select query to check results"
      );
    })
    .catch((e) => {
      console.log(
        "Value already inserted according to primary key. Run select query to check results"
      );
    });
});

app.get("/addTrigger", (req, res, next) => {
  pool
    .query(
      "CREATE OR REPLACE FUNCTION updateEmployeeCount() RETURNS TRIGGER AS $$ BEGIN UPDATE departments SET employee_count = employee_count + 1 WHERE id = NEW.department_id; RETURN NEW; END; $$ LANGUAGE plpgsql; CREATE TRIGGER updateEmployeeCountTrigger AFTER INSERT ON employees FOR EACH ROW EXECUTE PROCEDURE updateEmployeeCount();"
    )
    .then((testData) => {
      res.send("Output: Trigger Added!");
    })
    .catch((e) => {
      console.log("Trigger Updated");
    });
});

const server = app.listen(3000, function () {
  let host = server.address().address;
  let port = server.address().port;
});
