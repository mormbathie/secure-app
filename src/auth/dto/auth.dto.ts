export class SignUpDto{
    email: string;
    password: string;
    name?: string;
    lastName?: string;
    job?: string;
}

export class LoginDto{
    email: string;
    password: string;

}