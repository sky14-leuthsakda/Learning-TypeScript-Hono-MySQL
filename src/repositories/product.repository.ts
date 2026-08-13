import pool from "../db.js";
import type { CreateProductInput, UpdateProductInput } from "../schemas/product.js";

export const findAllProducts = async () => {
    const [rows] = await pool.query(
        "SELECT * FROM products"
    );
    return rows;
};

export const findProductById = async (id: string) => {
    const [rows] = await pool.query<any[]>(
        "SELECT * FROM products WHERE id = ?", [id]
    );
    return rows[0] ?? null;
};

export const createProduct = async (data: CreateProductInput) => {
    const [result] = await pool.query<any>(
        "INSERT INTO products (name, price, description, stock) VALUES (?, ?, ?, ?)",
        [data.name, data.price, data.description ?? null, data.stock ?? 0]
    );
    return result.insertId;
};

export const updateProduct = async (id: string, data: UpdateProductInput) => {
    const [result] = await pool.query<any>(
        "UPDATE products SET name = ?, price = ?, description = ?, stock = ? WHERE id = ?",
        [data.name, data.price, data.description ?? null, data.stock ?? 0, id]
    );
    return result.affectedRows;
};

export const deleteProduct = async (id: string) => {
    const [result] = await pool.query<any>(
        "DELETE FROM products WHERE id = ?",
        [id]
    );
    return result.affectedRows;
};






