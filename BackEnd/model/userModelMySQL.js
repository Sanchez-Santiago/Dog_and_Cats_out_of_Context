// models/userModelMySQL.js
import { connection } from '../db/MySQL.js';
export class UserModelMySQL {
    constructor() {
        this.connection = connection;  // Aquí guardas el objeto connection
    }

    getAllUsers = async () => {
        const sql = `SELECT * FROM user`;
        const [rows] = await this.connection.execute(sql);
        return rows;
    }

    getUserByEmail = async ({ email }) => {
        const sql = `SELECT * FROM user WHERE email = ?`;
        const [rows] = await this.connection.execute(sql, [email]);
        return rows[0];
    }

    getUserById = async ({ id }) => {
        const sql = `SELECT * FROM user WHERE iduser = ?`;
        const [rows] = await this.connection.execute(sql, [id]);
        return rows[0];
    }

    addUser = async ({ input }) => {
        const sql = `INSERT INTO user (name, email, password) VALUES (?, ?, ?)`;
        const [rows] = await this.connection.execute(sql, [input.name, input.email, input.password]);
        return rows[0];
    }

    updateUser = async ({ id, input }) => {
        const sql = `UPDATE user SET name = ?, email = ?, password = ? WHERE iduser = ?`;
        const [rows] = await this.connection.execute(sql, [input.name, input.email, input.password, id]);
        return rows[0];
    }

    deleteUser = async ({ id }) => {
        const sql = `DELETE FROM user WHERE iduser = ?`;
        const [rows] = await this.connection.execute(sql, [id]);
        return rows[0];
    }
}