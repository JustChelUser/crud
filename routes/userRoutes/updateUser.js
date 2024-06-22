const data = require("../../data");
module.exports = (req, res) => {
    const id = parseInt(req.url.split('/')[2]);
    let body = '';
    req.on('data', chunk => {
        body += chunk;
    });
    req.on('end', async () => {
        const parsedBody = new URLSearchParams(body);
        const updateData = {};
        parsedBody.forEach((value, key) => {
            updateData[key] = key === 'age' ? parseInt(value) : value;
        });

        const user = await data.getUserById(id);
        if (user.length > 0) {
            let checkTel = await data.checkUniqueTel(updateData['tel']);
            //таких же номеров не найдено либо найден но принадлежит этому же пользователю, а потому этот номер вставить можно
            if (checkTel.length === 0 || (checkTel.length === 1 && checkTel[0].id === id)) {
                const updatedUser = await data.updateUser(id, updateData);
                if (updatedUser) {
                    res.writeHead(200);
                    res.end(JSON.stringify(updatedUser));
                } else {
                    res.writeHead(404);
                    res.end(JSON.stringify({ messsage: 'User was not updated' }));
                }
            }
            else {
                res.writeHead(409);
                res.end(JSON.stringify({ messsage: 'tel are not unique' }));

            }
        }
        else {
            res.writeHead(404);
            res.end(JSON.stringify({ messsage: 'User not found' }));
        }
    });
}