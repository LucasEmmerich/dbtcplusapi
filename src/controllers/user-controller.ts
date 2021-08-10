import { Request, Response, NextFunction } from "express";
import { encrypt, verifyHash } from '../utils/cryptography';
import { create, update, findOne } from "../services/user-service";
import { generate, tokenInfo } from "../utils/auth";
import User from "../models/user";

class UserController {

    async authMiddleware(request: Request, response: Response, forward: NextFunction) {
        const { authorization } = request.headers;
        if (!authorization) {
            return response.status(401).end('Unauthorized');
        }
        else {
            const { valid, result } = tokenInfo(authorization);
            if (valid) {
                const { id, name, login } = result.user;
                request.body.user_info = { id, name, login };
                forward();
            }
        }
    };

    async create(request: Request, response: Response) {
        const {
            name,
            email,
            login,
            password
        } = request.body;

        const encryptedPassword = encrypt(password);

        const user = new User(0, name, email, login, encryptedPassword);

        await create(user);

        return response.status(201).end();
    };

    async update(request: Request, response: Response) {
        const {
            user_info,
            name,
            email,
            login,
            password
        } = request.body;

        const encryptedPassword = encrypt(password);

        const user = new User(user_info.id, name, email, login, encryptedPassword);

        await update(user);

        return response.status(201).end();
    };

    async authenticate(request: Request, response: Response) {
        const {
            login,
            password
        } = request.body;

        const user = await findOne({ login });

        if (!user) {
            return response.status(200).json({
                authorized: false,
                message: ['user_not_found']
            });
        }
        else if (!verifyHash(password, user.password)) {
            return response.status(200).json({
                authorized: false,
                message: ['wrong_password']
            });
        }
        else {
            const {
                token,
                expires
            } = generate(user);
            return response.status(200).json({
                authorized: true,
                token,
                expires
            });
        }
    };

    async emailExists(request: Request, response: Response) {
        const email = request.query['email']?.toString() ?? '';

        if (!email) {
            return response.status(400).end();
        }

        const data = await findOne({ email });

        return response.status(200).json({
            email,
            exists: !!data
        });
    };

    async loginExists(request: Request, response: Response) {
        const login = request.query['login']?.toString() ?? '';

        if (!login) {
            return response.status(400).end();
        }

        const data = await findOne({ login });

        return response.status(200).json({
            login,
            exists: !!data
        });
    };

}

export default UserController;