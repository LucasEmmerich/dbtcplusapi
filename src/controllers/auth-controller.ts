import { Request, Response } from "express";

class AuthController {
    login(request: Request, response: Response) {
        return response.json('logado');
    }
}

export default AuthController;