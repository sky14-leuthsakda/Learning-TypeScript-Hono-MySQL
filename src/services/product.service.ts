import * as productRopository from "../repositories/product.repository.js";
import { AppError } from "../utils/AppError.js";
import type { CreateProductInput, UpdateProductInput } from "../schemas/product.js";
import { number } from "zod";

export const getAllProducts = async () => {
    return await productRopository.findAllProducts();
};

export const getProductById = async (id: string) => {
    const product = await productRopository.findProductById(id);
    if (!product) {
        throw new AppError(`ບໍ່ພົບສິນຄ້າ ID: ${id}`, 404);
    }
    return product;
};

export const createNewProduct = async (data: CreateProductInput) => {
    const insertId = await productRopository.createProduct(data);
    return { id: insertId, name: data.name, price: data.price };
};

export const updateExistingProduct = async (id: string, data: UpdateProductInput) => {
    const affectedRows = await productRopository.updateProduct(id, data);
    if (affectedRows === 0) {
        throw new AppError(`ບໍ່ພົບສິນຄ້າ ID: ${id}`, 404);
    }
    return { id: number(id), ...data};
};

export const deleteExistingProduct = async (id: string) => {
    const affectedRows = await productRopository.deleteProduct(id);
    if (affectedRows === 0) {
        throw new AppError(`ບໍ່ພົບສິນຄ້າ ID: ${id}`, 404);
    }
};