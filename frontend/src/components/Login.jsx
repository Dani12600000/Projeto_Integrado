import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Verifica se o usuário já está logado
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            navigate('/home'); // Redireciona para a página inicial se já estiver logado
        }
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const loginResponse = await axios.post('http://localhost:3001/login', { email, password });

            if (loginResponse.data === "Success") {
                console.log("Login Success");
                alert('Login successful!');

                const userDetailsResponse = await axios.get(`http://localhost:3001/userDetails?email=${email}`);
                localStorage.setItem('user', JSON.stringify({ name: userDetailsResponse.data.name })); // Armazena os detalhes do usuário no localStorage
                navigate('/home'); // Navega para a página inicial
            } else {
                alert('Incorrect password! Please try again.');
            }
        } catch (err) {
            console.error('An error occurred during login:', err);
            if (err.response) {
                console.error('Response data:', err.response.data);
                console.error('Response status:', err.response.status);
                alert('An error occurred. Please check your email and password or try again later.');
            } else {
                alert('An error occurred. Please try again later.');
            }
        }
    }

    return (
        <div>
            <div className="d-flex justify-content-center align-items-center text-center vh-100" style={{ backgroundImage: "linear-gradient(#00d5ff,#0095ff,rgba(93,0,255,.555))" }}>
                <div className="bg-white p-3 rounded" style={{ width: '40%' }}>
                    <h2 className='mb-3 text-primary'>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 text-start">
                            <label htmlFor="exampleInputEmail1" className="form-label">
                                <strong>Email Id</strong>
                            </label>
                            <input
                                type="email"
                                placeholder="Enter Email"
                                className="form-control"
                                id="exampleInputEmail1"
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="exampleInputPassword1" className="form-label">
                                <strong>Password</strong>
                            </label>
                            <input
                                type="password"
                                placeholder="Enter Password"
                                className="form-control"
                                id="exampleInputPassword1"
                                onChange={(event) => setPassword(event.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Login</button>
                    </form>
                    <p className='container my-2'>Don&apos;t have an account?</p>
                    <Link to='/register' className="btn btn-secondary">Register</Link>
                </div>
            </div>
        </div>
    )
}

export default Login;