const data = require("../../data");
module.exports = (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk;
    });
    req.on('end', async () => {
        const parsedBody = new URLSearchParams(body);
        const name = parsedBody.get('name');
        const age = parsedBody.get('age');
        const tel = parsedBody.get('tel');
        const city = parsedBody.get('city');
        if (name && age && tel && city) {
            let checkTel = await data.checkUniqueTel(tel);
            if (checkTel.length === 0) {
                const user = { name, age: parseInt(age), tel, city };
                const createdUser = await data.addUser(user);
                res.writeHead(201);
                res.end(JSON.stringify(createdUser));
            }
            else {
                res.writeHead(409);
                res.end(JSON.stringify({ messsage: 'tel are not unique' }));
            }
        } else {
            res.writeHead(400);
            res.end(JSON.stringify({ messsage: 'name,age,tel,city are required' }));
        }

    });
}