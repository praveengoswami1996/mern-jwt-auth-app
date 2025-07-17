import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Flex,
  Box,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  Link as ChakraLink,
  Container,
  AlertRoot,
  AlertIndicator,
  AlertContent,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { sendPasswordResetEmail } from "../lib/api";

interface FormErrors {
  email?: string;
}

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});

  const {
    mutate: sendPasswordReset,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: sendPasswordResetEmail,
  });

  const validateEmail = (email: string): FormErrors => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
    }

    return newErrors;
  };

  const handleFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const validationErrors = validateEmail(email);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      sendPasswordReset(email);
    } else {
      console.log("Form has validation errors : ", validationErrors);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg={"#0f172a"}>
      <Container mx="auto" maxW="md" py={12} px={6} textAlign="center">
        <Heading fontSize="4xl" mb={8} color="#42A5F5">
          Reset your password
        </Heading>
        <Box rounded="lg" bg="#1e293b" boxShadow="lg" p={8}>
          {isError && (
            <Box mb={3} color="red.400">
              {error.message || "An error occurred"}
            </Box>
          )}
          <Stack spaceY={4}>
            {isSuccess ? (
              <AlertRoot status={"success"} borderRadius={12}>
                <AlertIndicator />
                <AlertContent textAlign={"left"}>
                  <AlertTitle>Password reset email sent</AlertTitle>
                  <AlertDescription>
                    Email sent! Check your inbox for further instructions.
                  </AlertDescription>
                </AlertContent>
              </AlertRoot>
            ) : (
              <>
                <form onSubmit={handleFormSubmit} noValidate>
                  <FormControl id="email" mb={8}>
                    <FormLabel color={"#f8fafc"} mb={5}>
                      Email address
                    </FormLabel>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoFocus
                      color={"#ffffff"}
                    />
                    {errors.email && (
                      <Box mt={1} color="red.400" textAlign={"left"}>
                        {errors.email}
                      </Box>
                    )}
                  </FormControl>
                  <Button
                    type="submit"
                    my={2}
                    loading={isPending}
                    disabled={isPending}
                    bg={"#2196F3"}
                    w={"full"}
                  >
                    Reset Password
                  </Button>
                </form>
              </>
            )}
            <Text textAlign="center" fontSize="sm" color="#ffffff">
              Go back to{" "}
              <ChakraLink asChild color={"#42A5F5"}>
                <Link to="/login" replace>
                  Sign in
                </Link>
              </ChakraLink>
              &nbsp;or&nbsp;
              <ChakraLink asChild color={"#42A5F5"}>
                <Link to="/register" replace>
                  Sign up
                </Link>
              </ChakraLink>
            </Text>
          </Stack>
        </Box>
      </Container>
    </Flex>
  );
};
export default ForgotPassword;
