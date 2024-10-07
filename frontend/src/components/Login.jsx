import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Verifica se o usuário já está logado
        const userId = localStorage.getItem('userId');
        if (userId) {
            navigate('/home'); // Redireciona para a página inicial
        }
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Faz a requisição de login
            const loginResponse = await axios.post('http://localhost:3001/login', { email, password });

            // Verifica se o login foi bem-sucedido
            if (loginResponse.data.status === "Success") {
                console.log("Login Success");
                alert('Login successful!');

                // Armazena o ID e o nome do usuário no localStorage
                localStorage.setItem('userId', loginResponse.data.id); // Supondo que o ID esteja no response
                localStorage.setItem('userName', loginResponse.data.name); // Supondo que o nome esteja no response
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
    };

    return (
        <div>
            <div className="d-flex justify-content-center align-items-center text-center vh-100" style={{ backgroundImage: "linear-gradient(#00d5ff,#0095ff,rgba(93,0,255,.555))" }}>
                <div className="bg-white p-3 rounded" style={{ width: '40%' }}>
                    <h2><Link to='/Home' className="btn btn-dark btn-lg">Home</Link></h2>
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
    );
};

export default Login;
