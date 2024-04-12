/********************************************************************************
 * WEB322 – Assignment 05
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Angelo Gatto Student ID: 017019159 Date: April 11 2024
 *
 * Published URL: https://bored-cod-dungarees.cyclic.app
 *
 ********************************************************************************/
// Formatted using Prettier
const legoData = require("./modules/legoSets");

legoData.Initialize();

const express = require("express"); // "require" the Express module
const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // assign a port

// Settin view engine to EJS
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); // urlenconded middleware

app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));

// All requests will go through public directory
app.use(express.static("public"));

//Requests to receive content stored at the path of '/'
app.get("/", (req, res) => {
  res.render("home", { page: "/" });
});

//Requests to receive content stored at the path of '/about'
app.get("/about", (req, res) => {
  res.render("about", { page: "/about" });
});

// Requests to receive content stored at the path of '/lego/sets'
// Utilizing getAllSets() and getSetsByTheme()
app.get("/lego/sets", (req, res) => {
  const theme = req.query.theme;
  let sets;
  if (theme) {
    sets = legoData.getSetsByTheme(theme);
  } else {
    sets = legoData.getAllSets();
  }

  sets
    .then(function (lego) {
      res.render("sets", { sets: lego });
    })
    .catch(function (err) {
      res
        .status(404)
        .render("404", {
          message: `Unable to find requested set due to error: ${err}`,
        });
    });
});

// Gets set by set number
app.get("/lego/sets/:setNum", (req, res) => {
  const setNum = req.params.setNum;
  legoData
    .getSetByNum(setNum)
    .then(function (lego) {
      res.render("set", { set: lego });
    })
    .catch(function (err) {
      res
        .status(404)
        .render("404", {
          message: `Unable to find requested set due to error: ${err}`,
        });
    });
});

// Get all themes
app.get("/lego/addSet", (req, res) => {
  legoData
    .getAllThemes()
    .then(function (themes) {
      res.render("addSet", { themes });
    })
    .catch(function (error) {
      res.render("500", {
        message: `I'm sorry, but we have encountered the following error: ${error}`,
      });
    });
});

// Add Set to Collection
app.post("/lego/addSet", (req, res) => {
  legoData
    .addSet(req.body)
    .then(function () {
      res.redirect("/lego/sets");
    })
    .catch((err) => {
      res.render("500", {
        message: `Sorry, we have encountered the following error: ${err}`,
      });
    });
});

//Edit Set
app.get("/lego/editSet/:setNum", (req, res) => {
  const setNum = req.params.setNum;
  legoData
    .getSetByNum(setNum)
    .then(function (setData) {
      legoData.getAllThemes().then(function (themeData) {
        res.render("editSet", { set: setData, themes: themeData });
      });
    })
    .catch(function (error) {
      res
        .status(404)
        .render("404", { message: "Unable to find requested set.", error });
    });
});

// Submit Updated Set
app.post("/lego/editSet", (req, res) => {
  let setData = req.body;
  let setNum = req.body.setNum;
  legoData
    .editSet(setNum, setData)
    .then(function () {
      res.redirect("/lego/sets");
    })
    .catch(function (err) {
      res.render("500", {
        message: `I'm sorry, but we have encountered the following error: ${err}`,
      });
    });
});

// Delete Set
app.get("/lego/deleteSet/:setNum", (req, res) => {
  const setNum = req.params.setNum;
  legoData
    .deleteSet(setNum)
    .then(function () {
      res.redirect("/lego/sets");
    })
    .catch(function (err) {
      res.render("500", {
        message: `I'm sorry, but we have encountered the following error: ${err}`,
      });
    });
});

//404 Request
app.use(function (req, res) {
  res.status(404).render("404", {
    message: "I'm sorry, we're unable to find what you're looking for.",
  });
});
