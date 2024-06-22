const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('myDB');

db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    tel TEXT NOT NULL UNIQUE,
    city TEXT NOT NULL
)`);
module.exports = {
    async getUsers() {
        try {
            const users = await new Promise((resolve, reject) => {
                db.all('SELECT * FROM users', [], (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(rows);
                    }
                });
            });
            return users;
        } catch (err) {
            return null;
        }
    },
    async addUser(user) {
        const lastID = await new Promise((resolve, reject) => {
            db.all('INSERT INTO users (name,age,tel,city) VALUES (?,?,?,?)', [user.name, user.age, user.tel, user.city], function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(this.lastID);
                }
            });
        });
        return { ...user, id: lastID };
    },
    async updateUser(id, updateData) {
        const changes = await new Promise((resolve, reject) => {
            db.run('UPDATE users  SET name = ?,age = ?,tel = ?,city = ? WHERE id = ?', [updateData.name, updateData.age, updateData.tel, updateData.city, id], function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(this.changes);
                }
            });
        });
        if (changes === 0) {
            return null;
        }
        return this.getUserById(id);
    },
    async deleteUser(id) {
        const changes = await new Promise((resolve, reject) => {
            db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(this.changes);
                }
            });
        });
        return changes > 0;
    },
    async getUserById(id) {
        const user = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM users WHERE id = ?', [id], function (err, row) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(row);
                }
            });
        });
        return user;
    },
    async checkUniqueTel(tel) {
        const dbTel = await new Promise((resolve, reject) => {
            db.all('SELECT id,tel FROM users WHERE tel = ?', [tel], function (err, row) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(row);
                }
            });
        });
        return dbTel;
    },
}