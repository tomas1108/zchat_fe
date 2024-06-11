import React from "react";
import FormProvider from "../../components/hook-form/FormProvider";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import { RHFTextField } from "../../components/hook-form";
import { ForgotPassword } from "../../redux/slices/auth";
import { useDispatch } from "react-redux";
import { LoadingButton } from "@mui/lab";

const ResetPasswordForm = () => {
    const dispatch = useDispatch();
    const {isLoading} = useSelector((state) => state.auth);
    const ResetpasswordSchema = Yup.object().shape({
        email: Yup.string()
            .required("Email is required")
            .email("Email must be a valid email address"),

    })

    const defaultValues = {
        email: "nguyendo76ngant@gmail.com",
    }

    const methods = useForm({
        resolver: yupResolver(ResetpasswordSchema),
        defaultValues,
    });

    const { reset, setError, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful } } = methods;

    const onSubmit = async (data) => {
        try {
            dispatch(ForgotPassword(data));

        } catch (error) {
            console.log(error);
            reset();
            setError("affterSubmit", {
                ...error,
                message: error.message,
            });

        }
    }

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <RHFTextField name="email" label="Email address" />
    
          <LoadingButton
            loading={isLoading}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            sx={{
              mt: 3,
              bgcolor: "text.primary",
              color: (theme) =>
                theme.palette.mode === "light" ? "common.white" : "grey.800",
              "&:hover": {
                bgcolor: "text.primary",
                color: (theme) =>
                  theme.palette.mode === "light" ? "common.white" : "grey.800",
              },
            }}
          >
            Send Request
          </LoadingButton>
        </FormProvider>
      );
}
export default ResetPasswordForm;
