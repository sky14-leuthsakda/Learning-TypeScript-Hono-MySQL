import pool from "../db.js";

export const findUserByEmail = async (email: string) => {
    const [rows] = await pool.query<any[]>(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );
    return rows[0] ?? null;
};


export const createUser = async (
    email: string,
    hashedPassword: string,
    name: string
) => {
    const [result] = await pool.query<any>(
        "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
        [email, hashedPassword, name]
    );
    return result.insertId;
};