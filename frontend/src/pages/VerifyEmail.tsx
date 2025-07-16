import { useQuery } from "@tanstack/react-query";
import { useParams, Link} from "react-router-dom";
import {
  Container,
  Flex,
  Link as ChakraLink,
  Spinner,
  Text,
  VStack,
  AlertRoot,
  AlertIndicator,
  AlertContent,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { verifyEmail } from "../lib/api";

const VerifyEmail = () => {
  const { code } = useParams();
  const { isPending, isSuccess, isError } = useQuery({
    queryKey: ["emailVerification", code],
    queryFn: () => verifyEmail(code as string),
  });

  return (
    <Flex minH="100vh" justify="center" mt={12}>
      <Container mx="auto" maxW="md" py={12} px={6} textAlign="center">
        {isPending ? (
          <Spinner />
        ) : (
          <VStack align="center" spaceY={6}>
            <AlertRoot
              status={isSuccess ? "success" : "error"}
              borderRadius="lg"
            >
              <AlertIndicator />
              <AlertContent>
                <AlertTitle>{isSuccess ? "Success!" : "Error"}</AlertTitle>
                <AlertDescription>
                  {isSuccess ? "Email Verified!" : "Invalid Link"}
                </AlertDescription>
              </AlertContent>
            </AlertRoot>

            {isError && (
              <Text color="gray.400">
                The link is either invalid or expired.{" "}
                <ChakraLink asChild>
                  <Link to={"/password/forgot"} replace>Get a new link</Link>
                </ChakraLink>
              </Text>
            )}
            <ChakraLink asChild>
              <Link to={"/"} replace>Back to home</Link>
            </ChakraLink>
          </VStack>
        )}
      </Container>
    </Flex>
  );
};
export default VerifyEmail;
