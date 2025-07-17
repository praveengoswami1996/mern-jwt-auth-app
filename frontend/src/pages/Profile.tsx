import { AlertIndicator, AlertRoot, AlertTitle, Center, Heading, Text } from "@chakra-ui/react";
import useAuth from "../hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();
  //@ts-ignore
  const { email, verified, createdAt } = user;

  return (
    <Center mt={16} flexDir="column">
      <Heading size={"3xl"} mb={4} color={"#42A5F5"}>
        My Account
      </Heading>
      {!verified && (
        <AlertRoot status="warning" borderRadius={12} w={"fit-content"} mb={3}>
          <AlertIndicator />
          <AlertTitle>Please verify your email</AlertTitle>
        </AlertRoot>
      )}
      <Text color="white" mb={2}>
        Email:{" "}
        <Text as="span" color="gray.300">
          {email}
        </Text>
      </Text>
      <Text color="white">
        Created on{" "}
        <Text as="span" color="gray.300">
          {new Date(createdAt).toLocaleDateString("en-US")}
        </Text>
      </Text>
    </Center>
  );
};
export default Profile;
