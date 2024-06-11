import { Stack, Typography, Button } from "@mui/material";
import React from "react";
import { Link, Link as RouterLink } from "react-router-dom"

import LoginForm from "../../sections/auth/LoginForm";
const Login = () => {
    return (
        <>
            <Stack spacing={3} sx={{paddingTop: 2, position: "relative" }}>
                <Typography variant="h4">Let's chat GENZ</Typography>

                {/* Login Form */}
                <LoginForm />

                 {/* Auth Social */}
                 {/* <AuthSocial /> */}
            

            </Stack>
        </>
    );
};
export default Login;