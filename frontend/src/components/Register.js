import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('primary');
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!username.trim() || !password.trim()) {
            setMessage('Completa tu usuario y contraseña.');
            setMessageType('error');
            return;
        }

        try {
            const response = await axios.post('/register', { username, password });
            setMessage('Registro exitoso.');
            setMessageType('primary');
            localStorage.setItem('username', response.data.username);
            navigate('/account-details');
        } catch (error) {
            setMessage(error.response?.data?.message || 'No se pudo completar el registro.');
            setMessageType('error');
        }
    };

    return (
        <Container maxWidth="xs">
            <Paper elevation={3} style={{ padding: 20, marginTop: 50 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Crear cuenta
                </Typography>
                <Box component="form" noValidate autoComplete="off">
                    <TextField
                        label="Usuario"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        label="Contraseña"
                        type="password"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {message && (
                        <Typography color={messageType} align="center">
                            {message}
                        </Typography>
                    )}
                    <Box textAlign="center" marginTop={2}>
                        <Button variant="contained" color="primary" onClick={handleRegister} fullWidth>
                            Registrarme
                        </Button>
                    </Box>
                    <Box textAlign="center" marginTop={2}>
                        <Link onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                            Volver al inicio de sesión
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Register;
