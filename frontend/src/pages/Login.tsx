import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
} from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { login } from "@/lib/api";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const redirectUrl = location.state?.redirectUrl || "/";

  const {
    mutate: signIn,
    isPending,
    isError,
  } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate(redirectUrl, {
        replace: true,
      });
    },
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear the error for the current field as the user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: undefined,
      }));
    }
  }

  const validateForm = (data: FormData): FormErrors => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!data.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(data.email)) {
      newErrors.email = "Invalid email format";
    }

    if(!data.password.trim()) {
      newErrors.password = "Password is required";
    } else if (data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long"
    }

    return newErrors;
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if(Object.keys(validationErrors).length === 0) {
      signIn(formData);
    } else {
      console.log("Form has validation errors : ", validationErrors)
    }
  } 

  return (
    <Flex minH="100vh" align="center" justify="center" bg={"#0f172a"}>
      <Container mx="auto" maxW="md" py={12} px={6} textAlign="center">
        <Heading fontSize="4xl" mb={8} color="#42A5F5">
          Sign in to your account
        </Heading>
        <Box rounded="lg" bg="#1e293b" boxShadow="lg" p={8}>
          {isError && (
            <Box mb={3} color="red.400">
              Invalid email or password
            </Box>
          )}
          <form onSubmit={handleFormSubmit} noValidate>
            <Stack spaceY={4}>
              <FormControl id="email">
                <FormLabel color={"#f8fafc"} mb={5}>
                  Email address
                </FormLabel>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoFocus
                  color={"#ffffff"}
                />
                {errors.email && (
                  <Box mt={1} color="red.400" textAlign={"left"}>
                    {errors.email}
                  </Box>
                )}
              </FormControl>
              <FormControl id="password">
                <FormLabel color="#f8fafc" mb={5}>
                  Password
                </FormLabel>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  color={"#ffffff"}
                />
                {errors.password && (
                  <Box mt={1} color="red.400" textAlign={"left"}>
                    {errors.password}
                  </Box>
                )}
              </FormControl>
              <ChakraLink
                asChild
                fontSize="sm"
                textAlign={"right"}
                color={"#42A5F5"}
              >
                <Link to={"/password/forgot"}>Forgot password?</Link>
              </ChakraLink>
              <Button
                type="submit"
                bg={"#2196F3"}
                color={"#ffffff"}
                my={2}
                loading={isPending}
              >
                Sign in
              </Button>
              <Text textAlign="center" fontSize="sm" color="#ffffff">
                Don&apos;t have an account?{" "}
                <ChakraLink asChild color={"#42A5F5"}>
                  <Link to={"/register"}>Sign Up</Link>
                </ChakraLink>
              </Text>
            </Stack>
          </form>
        </Box>
      </Container>
    </Flex>
  );
};
export default Login;
