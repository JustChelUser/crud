const http = require('http');
const routeHandler = require('./routes/router');
const server = http.createServer(routeHandler);
const PORT = 3000;
server.listen(PORT, () => {
    console.log("server is running on port "+PORT);
});