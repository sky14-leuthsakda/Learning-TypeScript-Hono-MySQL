import type { Context, Next } from "hono";
import jwt from "jsonwebtoken";
import type { Variables } from "../types.js";

export const authMiddleware = async (
  c: Context<{ Variables: Variables }>,
  next: Next) => {

  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json(
      { success: false, message: "ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນ" },
      401
    );
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return c.json(
        {
            success: false,
            message: "Token ບໍ່ຖືກຕ້ອງ"
        },
        401
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "") as Variables["user"];
    c.set("user", decoded);
    await next();
  } catch (error) {
    return c.json(
      { success: false, message: "Token ບໍ່ຖືກຕ້ອງ ຫຼື ໝົດອາຍຸ" },
      401
    );
  }
};