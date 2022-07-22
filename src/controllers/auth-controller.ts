import { NextFunction, Request, Response } from "express";
import { findOne } from "../services/user-service";
import { generate, tokenInfo } from "../utils/auth";
import { verifyHash } from "../utils/cryptography";

class AuthController {

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
            } else {
                return response.status(401).end('Unauthorized');
            }
        }
    };

    async authenticate(request: Request, response: Response) {
        const {
            login,
            password
        } = request.body;

        const user = await findOne({ login, active: true });

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

}

export default AuthController;