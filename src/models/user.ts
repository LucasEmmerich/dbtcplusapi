import { loginRegExp, mailRegExp } from "../utils/regex";

class User {
    id?: number = 0;
    name?: string;
    email?: string;
    login?: string;
    password?: string;
    active?: boolean;

    constructor(id: number = 0, name: string, email: string, login: string, password: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.login = login;
        this.password = password;
        this.active = false;
    }

    validate = () : { errors: Array<string>, valid: boolean } => {
        const errors : Array<string> = [];

        if(this.name && this.name.length <= 2){
            errors.push('Nome inválido');
        }
        if(this.email && !mailRegExp.test(this.email)){
            errors.push('Email inválido');
        } 
        if(this.login && !loginRegExp.test(this.login)){
            errors.push('Nome de usuário inválido');
        }
        if(this.password && this.password.length <= 6){
            errors.push('Senha inválida');
        } 

        if(errors.length > 0){
            return {
                errors,
                valid: true
            }
        }

        return {
            errors,
            valid: true
        }
    }
}

export default User;