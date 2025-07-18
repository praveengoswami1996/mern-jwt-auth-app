import { AlertIndicator, AlertRoot, AlertTitle, Center, Heading, Text } from "@chakra-ui/react";
import { useUser } from "@/contexts/UserContext";

const Profile = () => {
  const user = useUser();

  return (
    <Center mt={16} flexDir="column">
      <Heading size={"3xl"} mb={4} color={"#42A5F5"}>
        My Account
      </Heading>
      {!user.verified && (
        <AlertRoot status="warning" borderRadius={12} w={"fit-content"} mb={3}>
          <AlertIndicator />
          <AlertTitle>Please verify your email</AlertTitle>
        </AlertRoot>
      )}
      <Text color="white" mb={2}>
        Email:{" "}
        <Text as="span" color="gray.300">
          {user.email}
        </Text>
      </Text>
      <Text color="white">
        Created on{" "}
        <Text as="span" color="gray.300">
          {new Date(user.createdAt).toLocaleDateString("en-US")}
        </Text>
      </Text>
    </Center>
  );
};
export default Profile;
