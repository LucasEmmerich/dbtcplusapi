class User {
    id: Number = 0;
    email: string;
    login: string;
    password: string;

    constructor(id: Number = 0, email: string, login: string, password: string) {
        this.id = id;
        this.email = email;
        this.login = login;
        this.password = password;
    }

    toJson = () => JSON.stringify(this);
}

export default User;