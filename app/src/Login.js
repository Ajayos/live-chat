import React from 'react';
import { Typography, TextField, Button, Grid, Box } from '@mui/material';


const Login = ({ name, setName, handleSubmit }) => {
    return (
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                sx={{ height: '100vh', padding: 2 }}
            >
                <Grid item xs={12} sm={8} md={4}>
                    <Box
                        sx={{
                            border: '2px solid',
                            borderColor: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)',
                            boxShadow: '0px 0px 10px 5px rgba(255, 255, 255, 0.5)',
                            borderRadius: '10px',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent black background
                            padding: 4,
                            width: '100%',
                        }}
                    >
                        <form
                            onSubmit={handleSubmit}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="h4" gutterBottom>
                                Login
                            </Typography>
                            <TextField
                                label="Name"
                                variant="outlined"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                sx={{
                                    marginBottom: 2,
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'transparent',
                                        '& fieldset': {
                                            borderColor: 'white',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'white',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'white',
                                        },
                                    },
                                    '& .MuiInputBase-input': {
                                        color: 'white',
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'white',
                                    },
                                }}
                            />
                            <Button type="submit" variant="contained" color="primary">
                                Submit
                            </Button>
                        </form>
                    </Box>
                </Grid>
            </Grid>
    );
};

export default Login;
