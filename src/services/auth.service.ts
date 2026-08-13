import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userRepository from "../repositories/user.repository.js";
import { AppError } from "../utils/AppError.js";

interface RegisterInput {
    email: string;
    password: string;
    name: string;
}

interface LoginInput {
    email: string;
    password: string;
}

export const registerUser = async (input: RegisterInput) => {
    const hashedPassword = await bcrypt.hash(input.password, 10);
    const insertId = await userRepository.createUser(
        input.email,
        hashedPassword,
        input.name
    );
    return {
        id: insertId,
        email: input.email,
        name: input.name
    };
};

export const loginUser = async (input: LoginInput) => {
    const user = await userRepository.findUserByEmail(input.email);

    if (!user) {
        throw new AppError("ອີເມວ ຫລື ລະຫັດຜ່ານ ບໍ່ຖືກຕ້ອງ", 401);
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);

    if (!isPasswordValid) {
        throw new AppError("ອີເມວ ຫລື ລະຫັດຜ່ານ ບໍ່ຖືກຕ້ອງ", 401);
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET ?? "",
        { expiresIn: "7d"}
    );

    return {
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
};