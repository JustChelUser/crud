const data = require("../../data");
module.exports = (req, res) => {
    const id = parseInt(req.url.split('/')[2]);
    let body = '';
    req.on('data', chunk => {
        body += chunk;
    });
    req.on('end', () => {
        const parsedBody = new URLSearchParams(body);
        const updateData = {};
        parsedBody.forEach((value, key) => {
            updateData[key] = key === 'age' ? parseInt(value) : value;
            updateData[key] = key === 'id' ? parseInt(value) : value;

        });
        if (!data.checkUniqueTel(updateData['tel'])) {
            const updatedUser = data.updateUser(id, updateData);
            if (updatedUser) {
                res.writeHead(200);
                res.end(JSON.stringify(updatedUser));
            } else {
                res.writeHead(404);
                res.end(JSON.stringify({ messsage: 'User not found' }));
            }
        }
        else {
            res.writeHead(409);
            res.end(JSON.stringify({ messsage: 'tel are not unique' }));

        }
    });
}