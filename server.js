
let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let mysql = require("mysql");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


let dbCon = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "flutter_student_db",
});
dbCon.connect();

// find all
app.get("/students", (req, res) => {
  dbCon.query("SELECT * FROM users", (eror, results, fields) => {
    if (eror) throw error;

    let message = "";
    if (results === undefined || results.length == 0) {
      message = "Student is Empty!";
    } else {
      message = "Success!";
    }
    return res.send({
      error: false,
      data: results,
      message: message,
    });
  });
});

// add student
app.post("/addStudent", (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;

  if (!name || !email || !password) {
    return res.status(400).send({
      error: true,
      message: "fail",
    });
  } else {
    dbCon.query(
      "INSERT INTO `users` (`id`, `name`, `email`, `password`) VALUES (NULL, ?,?,?);",
      [name, email, password],
      (error, results, fields) => {
        if (error) throw error;
        return res.send({
          error: false,
          data: results,
          message: "Student successfully added.",
        });
      }
    );
  }
});

// find by id
app.get("/Student/:id", (req, res) => {
  let id = req.params.id;

  if (!id) {
    return res.status(400).send({
      error: true,
      message: "fail",
    });
  } else {
    dbCon.query(
      "SELECT * FROM users WHERE id = ?",
      [id],
      (eror, results, fields) => {
        if (eror) throw error;

        let message = "";
        if (results === undefined || results.length == 0) {
          message = "Student by id is Empty!";
        } else {
          message = "Success!";
        }
        return res.send({
          error: false,
          data: results,
          message: message,
        });
      }
    );
  }
});

// update
app.put("/updateStudent", (req, res) => {
  let id = req.body.id;
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;

  if (!name || !email || !password) {
    return res.status(400).send({
      error: true,
      message: "fail",
    });
  } else {
    dbCon.query(
      "UPDATE `users` SET `name` = ?, `email` = ?, `password` = ? WHERE `users`.`id` = ?;",
      [name, email, password, id],
      (error, results, fields) => {
        if (error) throw error;
        let msg = "";
        if (results.changedRows === 0) {
          msg = "fail";
        } else {
          msg = "Student successfully updated.";
        }
        return res.send({
          error: false,
          data: results,
          message: msg,
        });
      }
    );
  }
});

// delete by id
app.delete("/deleteStudent", (req, res) => {
  let id = req.body.id;
  if (!id) {
    return res.send({
      error: false,
      message: "fail",
    });
  } else {
    dbCon.query(
      "DELETE FROM users WHERE id = ?",
      [id],
      (error, results, fields) => {
        if (error) throw error;
        let msg = "";
        if (results.affectedRows === 0) {
          msg = "fail";
        } else {
          msg = "Student successfully deleted.";
        }
        return res.send({
          error: false,
          data: results,
          message: msg,
        });
      }
    );
  }
});

// check login
app.post("/checkLogin", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  if (!email || !password) {
    return res.send({
      error: false,
      message: "login fail",
    });
  } else {
    console.log('email :'+email+', password :'+password);
    var sql = "SELECT * FROM users WHERE email = '"+email+"' && password = '"+password+"'";
    console.log(sql);
    dbCon.query(
      sql,
      (eror, results, fields) => {
        if (eror) throw error;

        let message = "";
        if (results === undefined || results.length == 0) {
          message = "fail";
        } else {
          message = "success";
        }
        return res.send({
          error: false,
          data: results,
          message: message,
        });
      }
    );
  }
});

app.get("/", (req, res) => {
  return res.send({
    err: false,
    message: "Welcome",
    written_by: "Kiatti",
    published_on: "https://alan.dev",
  });
});

app.listen(3000, () => {
  console.log("Server runing on port 3000");
});

module.exports = app;
