const express = require("express");
const { uuid } = require("uuidv4");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

let repositories = [];

app.get('/repositories', (request, response)=>{
const { title } = request.query;

const resultTitle = title
? repositories.filter(repositories => repositories.title.includes(title))
: repositories

return response.json(resultTitle);
});

app.post('/repositories', (request, response)=>{
const { title, url, tech} = request.body;

const repository = { 
  id: uuid(),
  title,
  url,
  tech, 
  like: 0 
};


repositories.push(repository);

return response.json(repository);
});

app.put('/repositories/:id', (request, response)=>{
  const { id } = request.params;
  const { title, url, tech } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0){
    return response.status(400).json({error: 'Repository not found.'});
  }

  const repository = {
    title,
    url,
    tech,
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete('/repositories/:id', (request, response)=>{
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0){
    return response.status(400).json({error: 'Repository not found.'});
  }

  repositories.splice(repositoryIndex, 1);
  
return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response)=>{

  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0){
    return response.status(400).json({error: 'Repository not found.'});
  }

  const likeIncrement = repositories.map(repository => {
    if ( repository.id===id){
      repository.like+=1;
    }
    return repository;
  });

  return response.json(likeIncrement);
});

module.exports = app;