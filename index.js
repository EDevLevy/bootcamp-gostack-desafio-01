const express = require('express');

var projects = [];
var totalRequests = 0;

const server = express();

server.use(express.json());

//middleware to check if project exists
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  let idx = projects.findIndex((project) => { return project.id === id });
  if (idx < 0) {
    return res.status(404).send('Project does not exists');
  }
  next();
}

//middleware to print total of requests
function log(req, res, next) {
  totalRequests++;
  console.log(`totalRequests :${totalRequests}`)
  next();
}

//one of the ways to use a middleware for all routes
server.use(log);
//another way is to put in each app route, like
//server.post('/projects',log, (req, res) => {

//this route receive three fields and create new project with them
server.post('/projects', (req, res) => {
  const { id, title, tasks } = req.body;

  let project = { id, title, tasks };

  projects.push(project);

  res.send();

});

server.get('/projects', (req, res) => {
  res.json(projects);
});

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  let idx = projects.findIndex((project) => { return project.id === id });
  projects[idx].title = title;
  res.json(projects[idx]);
});

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  let idx = projects.findIndex((project) => { return project.id === id });
  projects.splice(idx, 1);
  res.send();
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  let idx = projects.findIndex((project) => { return project.id === id });
  projects[idx].tasks.push(title);
  res.send();
});


server.listen(3000);
