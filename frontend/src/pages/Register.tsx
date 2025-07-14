import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
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
import { register } from "@/lib/api";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const {
    mutate: createAccount,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: register,
    onSuccess: () => {
      navigate("/", {
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
      setErrors((prevData) => ({
        ...prevData,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (data: FormData): FormErrors => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(data.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!data.password.trim()) {
      newErrors.password = "Password is required";
    } else if (data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (data.password && data.password.length >= 6) {
      if (!data.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (data.password !== data.confirmPassword) {
        newErrors.confirmPassword = "Password did not match";
      }
    }

    return newErrors;
  };

  const handleFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Control yaha par aa raha hai");
      createAccount(formData);
    } else {
      console.log("Form has validation errors : ", validationErrors);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg={"#0f172a"}>
      <Container mx="auto" maxW="md" py={12} px={6} textAlign="center">
        <Heading fontSize="4xl" mb={8} color="#42A5F5">
          Create an account
        </Heading>
        <Box rounded="lg" bg="#1e293b" boxShadow="lg" p={8}>
          {isError && (
            <Box mb={3} color="red.400">
              {error?.message || "An error occurred"}
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
                <FormLabel color={"#f8fafc"} mb={5}>
                  Password
                </FormLabel>
                <Input
                  type="password"
                  id="password"
                  name="password"
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
              <FormControl id="confirmPassword">
                <FormLabel color={"#f8fafc"} mb={5}>
                  Confirm Password
                </FormLabel>
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  color={"#ffffff"}
                />
                {errors.confirmPassword && (
                  <Box mt={1} color="red.400" textAlign={"left"}>
                    {errors.confirmPassword}
                  </Box>
                )}
              </FormControl>
              <Button 
                type="submit" 
                my={2} 
                loading={isPending} 
                bg={"#2196F3"}
                disabled={isPending}
              >
                Create Account
              </Button>
              <Text textAlign="center" fontSize="sm" color="#ffffff">
                Already have an account?{" "}
                <ChakraLink asChild color={"#42A5F5"}>
                  <Link to={"/login"}>Sign in</Link>
                </ChakraLink>
              </Text>
            </Stack>
          </form>
        </Box>
      </Container>
    </Flex>
  );
};
export default Register;
