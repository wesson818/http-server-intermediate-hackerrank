const projects = require('./data-store');
const server = require('http').createServer();

let projectsList = projects;

server.on('request', (req, res, next) => {

  const { url, method, headers} = req;
  switch(url) {
    case '/projects': {

      if(method === 'GET'){

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(projectsList));

      }else if (req.method === 'POST') {

        let body = [], project;
        req.on('error', (err) => {
          console.error(err);
        }).on('data', (chunk) => {
          body.push(chunk);
        }).on('end', () => {
          body = Buffer.concat(body).toString();
          let inValid = body.indexOf('{') === -1;
         
          project = inValid ? body:  JSON.parse(body);
    
          const isInvalid = inValid ? true : projects.some(p => p.id === project.id);
          if(isInvalid) {
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({'message':'BAD REQUEST'}));

          }else {
            projectsList = [...projects, project];
           res.writeHead(201, {'Content-Type': 'application/json'});
           res.end(JSON.stringify(projectsList));
          }
         
        });
      } 
    }
      break;
    
    default:
        res.writeHead(404)
        res.end('no found')
        break;
  }
})



module.exports = server;
