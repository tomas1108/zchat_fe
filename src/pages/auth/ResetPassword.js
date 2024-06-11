import { Link, Stack, Typography } from "@mui/material";
import { CaretLeft } from "phosphor-react";
import React from "react";
import { Link as RouterLink } from 'react-router-dom';
import ResetPasswordForm from "../../sections/auth/ResetPasswordFormSent";
import { useScreenDetector } from "../../hooks/useScreenDectector";

const ResetPassword = () => {
    const { isMobile, isTablet, isDesktop } = useScreenDetector();
    return(
        <>
        <Stack spacing={2} sx={{mb: 5, position:"relative"}}>
            <Typography variant="h3" paragraph>
                Forgot your Password?
            </Typography>
            <Typography sx={{color:"tex.secondary",mb:5}}>
                Please enter your email and we'll send you a link to reset your password.
            </Typography>
            {/*  Reset Pass Form */}
            <ResetPasswordForm />

            <Link component={RouterLink} to="/auth/login" color="inherit" variant="subtitle2" sx={{mt: 3, mx:"auto",alignItems:"center",display:"inline-flex"}}>
                <CaretLeft />
                Return to Login
            </Link>

        

        </Stack>



        </>

    )
}
export default ResetPassword;