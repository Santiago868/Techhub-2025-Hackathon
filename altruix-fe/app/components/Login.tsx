import { Form } from "react-router";

export interface LoginProps {
    defaultEmail?: string;
    defaultPassword?: string;
}

export default function Login({ defaultEmail, defaultPassword }: LoginProps) {
    return (
        <Form action="/login" method="post">
            <label>
                Username
                <input name="username" type="text" defaultValue={defaultEmail} required />
            </label>
            <label>
                Password
                <input name="password" type="password" defaultValue={defaultPassword} required />
            </label>
            <button type="submit">Login</button>
        </Form>
    );
}