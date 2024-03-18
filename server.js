/********************************************************************************
* WEB322 – Assignment 03
* 
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
* 
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
* Name: Angelo Gatto Student ID: 017019159 Date: March 18 2024
*
* Published URL: ___________________________________________________________
*
********************************************************************************/

const legoData = require("./modules/legoSets");

legoData.Initialize();


const path = require('path');
const express = require('express'); // "require" the Express module
const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // assign a port

app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));

// All requests will go through public directory
app.use(express.static('public'));

//Requests to receive content stored at the path of '/'
app.get('/', (req,res) =>
{
  res.sendFile(path.join(__dirname, '/views/home.html'));
});

//Requests to receive content stored at the path of '/about'
app.get('/about', (req,res) =>
{
  res.sendFile(path.join(__dirname, '/views/about.html'));
});

// Requests to receive content stored at the path of '/lego/sets'
// Utilizing getAllSets() and getSetsByTheme()
app.get('/lego/sets', (req,res) =>
{
  const theme = req.query.theme;
  let sets;
  if (theme)
  {
    sets = legoData.getSetsByTheme(theme);
  }
  else
  {
    sets = legoData.getAllSets();
  }

  sets.then(function(data) 
  {
    res.json(data);
  })
  .catch(function(error) 
  {
      res.status(404).send("Error! " + error);
      //res.json(error);
  });
});

// Gets set by set number
app.get('/lego/sets/:setNum', (req,res) =>
{
  const setNum = req.params.setNum;
  legoData.getSetByNum(setNum).then(function(data)
  {
    res.json(data)
  })
  .catch(function(error)
  {
    res.status(404).send("Error! " + error);
      //res.json(error);
  })
})

//404 Request
app.use(function(req, res) 
{
  res.status(404).sendFile(__dirname + '/views/404.html');
});