const projects = require('./data-store');
const server = require('http').createServer();

let projectsList = projects;

server.on('request', (req, res, next) => {

    const {
        url,
        method,
        headers
    } = req;
    switch (url) {
        case '/projects': {

            if (method === 'GET') {
                // Should respond with the correct data for GET /projects
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify(projectsList));

            } else if (req.method === 'POST') {

                let body = [], project;
                req.on('error', (err) => {
                    console.error(err);
                }).on('data', (chunk) => {
                    body.push(chunk);
                }).on('end', () => {
                    // console.log("before body>>>",body)
                    body = Buffer.concat(body).toString();
                    // console.log("after body>>>",body)
                    let inValid = body.indexOf('{') === -1;

                    project = inValid ? body : JSON.parse(body);
                    // Should return a 400 if the project id sent in body already exists
                    const isInvalid = inValid ? true : projects.some(p => p.id === project.id);
                    //   console.log("isInvalid",isInvalid)
                    if (isInvalid) {
                        res.writeHead(400, {
                            'Content-Type': 'application/json'
                        });
                        // Should return a 400 if post data is not a valid JSON
                        res.end(JSON.stringify({
                            'message': 'BAD REQUEST'
                        }));

                    } else {
                        // Should update and send the updated data after a valid POST /projects request
                        projectsList = [...projects, project];
                        res.writeHead(201, {
                            'Content-Type': 'application/json'
                        });
                        res.end(JSON.stringify(projectsList));
                    }

                });
            }
        }
        break;
    // Should return 404 for an invalid route
    default:
        res.writeHead(404)
        res.end('no found')
        break;
    }
})



module.exports = server;