class User {
    id: number = 0;
    name: string;
    email: string;
    login: string;
    password: string;

    constructor(id: number = 0, name: string, email: string, login: string, password: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.login = login;
        this.password = password;
    }
}

export default User;