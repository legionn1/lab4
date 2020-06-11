const express = require("express");
let bodyParser = require("body-parser");
let moment = require("moment-timezone");
let fs = require("fs");
const app = express();
app.use(bodyParser.json());
let mass = JSON.parse(
  fs.readFileSync("src/Students.JSON", "utf8", function(err, data) {
    return data;
  })
);
app.listen(8080);

app.get("/students", function(req, res) {
  res.send(
    fs.readFileSync("src/Students.JSON", function(err, data) {
      if (err) {
        return console.error(err);
      }
      return data;
    })
  );

  res.end();
});

app.get("/students/:id", function(req, res) {
  //  res.send(mass[req.url.slice(req.url.indexOf("students") + 9, req.url.length)]);
  res.send(
    mass.find(function Search(element, index, array) {
      if (
        element.id ===
        Number(req.url.slice(req.url.indexOf("students") + 9, req.url.length))
      ) {
        return element;
      } else return false;
    })
  );
  res.end();
});

app.post("/students", function(req, res) {
  let newStud = {
    id: mass.length + 1,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    group: req.body.group,
    createdAt: moment()
      .tz("Europe/Moscow")
      .format("YYYY-MM-DD HH:mm:ss"), // дата создания
    updatedAt: moment()
      .tz("Europe/Moscow")
      .format("YYYY-MM-DD HH:mm:ss")
  };
  mass[mass.length] = newStud;
  fs.writeFile("src/Students.JSON", JSON.stringify(mass), function(err) {
    if (err) {
      return console.error(err);
    }
  });

  res.send(mass);
  res.end();
});

app.put("/students/:id", function(req, res) {
  let index = mass.findIndex(function Search(element, index, array) {
    if (
      element.id ===
      Number(req.url.slice(req.url.indexOf("students") + 9, req.url.length))
    ) {
      return element;
    } else return false;
  });
  mass[index] = {
    id: mass[index].id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    group: req.body.group,
    createdAt: mass[index].createdAt,
    updatedAt: moment()
      .tz("Europe/Moscow")
      .format("YYYY-MM-DD HH:mm:ss")
  };
  fs.writeFile("src/Students.JSON", JSON.stringify(mass), function(err) {
    if (err) {
      return console.error(err);
    }
  });
  res.send(mass);
  res.end();
});

app.delete("/students/:id", function(req, res) {
  mass.splice(
    mass.findIndex(function Search(element, index, array) {
      if (
        element.id ===
        Number(req.url.slice(req.url.indexOf("students") + 9, req.url.length))
      ) {
        return element;
      } else return false;
    }),
    1
  );
  fs.writeFile("src/Students.JSON", JSON.stringify(mass), function(err) {
    if (err) {
      return console.error(err);
    }
  });
  res.send(mass);
  res.end();
});
