import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Heading,
  Input,
  Stack,
  Link as ChakraLink,
  AlertRoot,
  AlertIndicator,
  AlertTitle,
} from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { resetPassword } from "@/lib/api";

interface ResetPasswordFormProps {
  code: string;
}

interface FormErrors {
  password?: string;
}

const ResetPasswordForm = ({ code }: ResetPasswordFormProps) => {
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const {
    mutate: resetUserPassword,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: resetPassword,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassword(value);

    // Clear the error for the current field as the user types 
    if(errors[name as keyof FormErrors]) {
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: undefined
        }))
    }
  }

  const validatePassword = (password: string): FormErrors => {
    const newErrors: FormErrors = {};

    if (!password) {
      newErrors.password = "This field is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    return newErrors;
  };

  const handleFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const validationErrors = validatePassword(password);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      resetUserPassword({
        password,
        verificationCode: code,
      });
    } else {
      console.log("Form has validation errors : ", validationErrors);
    }
  };

  return (
    <>
      <Heading fontSize="4xl" mb={8} color="#42A5F5">
        Change your password
      </Heading>
      <Box rounded="lg" bg="#1e293b" boxShadow="lg" p={8}>
        {isError && (
          <Box mb={3} color="red.400">
            {error.message || "An error occurred"}
          </Box>
        )}
        {isSuccess ? (
          <Box>
            <AlertRoot status="success" borderRadius={12} mb={3}>
              <AlertIndicator />
              <AlertTitle>Password updated successfully.</AlertTitle>
            </AlertRoot>
            <ChakraLink asChild color={"#42A5F5"}>
              <Link to="/login" replace>
                Sign in
              </Link>
            </ChakraLink>
          </Box>
        ) : (
          <form onSubmit={handleFormSubmit} noValidate>
            <Stack spaceY={4}>
              <FormControl id="password">
                <FormLabel color={"#f8fafc"} mb={5}>
                  New Password
                </FormLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your new password"
                  value={password}
                  onChange={handleInputChange}
                  autoFocus
                  color={"#ffffff"}
                />
                {errors.password && (
                  <Box mt={1} color="red.400" textAlign={"left"}>
                    {errors.password}
                  </Box>
                )}
              </FormControl>
              <Button
                type="submit"
                my={2}
                loading={isPending}
                disabled={isPending}
                bg={"#2196F3"}
              >
                Reset Password
              </Button>
            </Stack>
          </form>
        )}
      </Box>
    </>
  );
};
export default ResetPasswordForm;
