export class User {
    protected _username: string;
    protected _name: string;
    protected _role: string;

    constructor(username: string, name: string, role: string) {
        this._username = username;
        this._name = name;
        this._role = role;
    }

    public isAdmin(): boolean {
        return this.role == 'admin';
    }

    public get name(): string {
        return this._name;
    }

    public set name(name: string) {
        this._name = name;
    }

    public get username(): string {
        return this._username;
    }

    public get role(): string {
        return this._role;
    }

    public static fromDict(data: any): User {
        return new User(data.username, data.name, data.role);
    }
}
