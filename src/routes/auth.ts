import { Hono } from "hono";
import * as authService from "../services/auth.service.js";

interface RegisterBody {
    email: string;
    password: string;
    name: string;
}

interface LoginBody {
    email: string;
    password: string;
}

const authRoutes = new Hono() 

authRoutes.post("/register", async (c) => {
    const body = await c.req.json<RegisterBody>();
    const newUser = await authService.registerUser(body);

    return c.json({
        success: true,
        message: "ລົງທະບຽນສຳເລັດ",
        data: newUser
    }, 201
   );
});

authRoutes.post("/login", async (c) => {
    const body = await c.req.json<LoginBody>();
    const result = await authService.loginUser(body);
    
    return c.json({
        success: true,
        message: "ເຂົ້າສູ່ລະບົບສຳເລັດ",
        data: result
    });
});


export default authRoutes;