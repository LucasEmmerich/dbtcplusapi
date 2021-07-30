import { Request, Response } from "express";
import { create } from "../services/user-service";

class UserController {
    async create(request: Request, response: Response) {
        const { email, login, password } = request.body;
        console.log(email)
        await create(email, login, password);
        return response.status(201).json('OK');
        // const user = new User(0, email, login, password);
        // console.log(user.toJson())
        // return response.json(user.toJson())
    }
}

export default UserController;