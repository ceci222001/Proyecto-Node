import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Container, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AccountDetails  = () => {
  const [accountDetails, setAccountDetails] = useState(null);
  const [error, setError] = useState(null);
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/');
  };

  useEffect(() => {
    if (!username) {
      setError('No hay una sesión activa.');
      return;
    }

    const fetchAccountDetails = async () => {
      try {
        const response = await axios.get('/bank/bank-details', {
          params: { username },
        });
        setAccountDetails(response.data.accountDetails);
      } catch (err) {
        setError(err.response?.data?.message || 'Ocurrió un error al cargar la cuenta.');
      }
    };

    fetchAccountDetails();
  }, [username]);

  if (error) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ marginTop: 4, textAlign: 'center' }}>
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            Ir al inicio
          </Button>
        </Box>
      </Container>
    );
  }

  if (!accountDetails) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ marginTop: 4, textAlign: 'center' }}>
          <Typography>Cargando datos de la cuenta...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Card sx={{ marginTop: 4, padding: 2 }}>
        <CardContent>
          <Grid container spacing={2} direction="column" alignItems="center">
            <Grid item>
              <Typography variant="h4" component="h1" gutterBottom>
                Bienvenido, {accountDetails.username}
              </Typography>
            </Grid>

            <Grid item container direction="column" alignItems="center">
              <Typography variant="subtitle1" color="textSecondary">
                Número de cuenta:
              </Typography>
              <Typography variant="h6">{accountDetails.accountNumber}</Typography>
            </Grid>

            <Grid item container direction="column" alignItems="center">
              <Typography variant="subtitle1" color="textSecondary">
                Saldo:
              </Typography>
              <Typography variant="h5" color="primary">
                ${accountDetails.balance}
              </Typography>
            </Grid>
            <Grid item>
              <Button variant="outlined" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AccountDetails;
