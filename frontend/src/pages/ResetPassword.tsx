import { useSearchParams, Link } from "react-router-dom";
import {
  Container,
  Flex,
  Link as ChakraLink,
  VStack,
  Text,
  AlertRoot,
  AlertIndicator,
  AlertTitle,
} from "@chakra-ui/react";
import ResetPasswordForm from "@/components/ResetPasswordForm";

const ResetPassword = () => {
  const [ searchParams ] = useSearchParams();
  const code = searchParams.get("code");
  const exp = Number(searchParams.get("exp"));
  const now = Date.now();
  const linkIsValid = code && exp && exp > now;

  return (
    <Flex minH="100vh" justify="center" bg={"#0f172a"}>
      <Container mx="auto" maxW="md" py={12} px={6} textAlign="center">
        {linkIsValid ? (
          <ResetPasswordForm code={code} />
        ) : (
          <VStack align="center" spaceY={6}>
            <AlertRoot status="error" borderRadius={12} w={"fit-content"}>
              <AlertIndicator />
              <AlertTitle>Invalid Link</AlertTitle>
            </AlertRoot>
            <Text color="gray.400">The link is either invalid or expired.</Text>
            <ChakraLink asChild color={"#42A5F5"}>
              <Link to="/password/forgot" replace>
                Request a new password reset link
              </Link>
            </ChakraLink>
          </VStack>
        )}
      </Container>
    </Flex>
  );
};
export default ResetPassword;
