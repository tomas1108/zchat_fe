import { Stack, Typography, Link } from "@mui/material";
import React from "react";
import VerifyForm from "../../sections/auth/VerifyForm";
import {Link as RouterLink} from 'react-router-dom';
import { CaretLeft } from "phosphor-react";

const Verify = () => {

    return(
        <>
      <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
        <Typography variant="h4">Please Verify OTP</Typography>
        <Typography variant="body2">
            Sent to user_email
          </Typography>
    
      </Stack>
      {/* Form */}
      <VerifyForm />
        </>
    )
}
export default Verify;