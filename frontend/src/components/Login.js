import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Grid, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({ username: false, password: false, message: '' });
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError({
        username: !username.trim(),
        password: !password.trim(),
        message: 'Completa tu usuario y contraseña.',
      });
      return;
    }

    try {
      const response = await api.post('/login', { username, password });
      localStorage.setItem('username', response.data.username);
      setError({ username: false, password: false, message: '' });
      navigate('/account-details');
    } catch (loginError) {
      setError({
        username: true,
        password: true,
        message: loginError.response?.data?.message || 'Usuario o contraseña incorrectos.',
      });
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} style={{ padding: 20, marginTop: 50 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Iniciar sesión
        </Typography>
        <Box component="form" noValidate autoComplete="off">
          <TextField
            label="Usuario"
            fullWidth
            margin="normal"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={error.username}
            helperText={error.username ? 'Revisa este campo.' : ''}
          />
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error.password}
            helperText={error.password ? 'Revisa este campo.' : ''}
          />
          {error.message && (
            <Typography color="error" align="center">
              {error.message}
            </Typography>
          )}

          <Grid container spacing={2} style={{ marginTop: 10 }}>
            <Grid item xs={6} textAlign="left">
              <Link onClick={() => navigate('/register')} style={{ cursor: 'pointer' }}>
                Crear cuenta
              </Link>
            </Grid>
            <Grid item xs={6} textAlign="right">
              <Button variant="contained" color="primary" onClick={handleLogin}>
                Entrar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
