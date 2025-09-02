import { useState } from 'react'

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });

    function onChange(e) {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    }

    function onSubmit(e) {
        e.preventDefault();
        console.log('Login attempt', form);
    }

    return (
        <form onSubmit={onSubmit} style={{ maxWidth: 320, margin: '0 auto', textAlign: 'left' }}>
            <h1>Login</h1>
            <label style={{ display: 'block', marginBottom: 12 }}>
                Email
                <input
                    style={{ width: '100%', marginTop: 4 }}
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    required
                />
            </label>
            <label style={{ display: 'block', marginBottom: 16 }}>
                Password
                <input
                    style={{ width: '100%', marginTop: 4 }}
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={onChange}
                    required
                />
            </label>
            <button type="submit" style={{ width: '100%' }}>Sign In</button>
        </form>
    );
}