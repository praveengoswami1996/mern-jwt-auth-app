import { Box, Button, Flex, Text } from "@chakra-ui/react";
import useDeleteSession from "@/hooks/useDeleteSession";
import type { Session } from "@/lib/api";

interface SessionCardProps {
  session: Session
}

const SessionCard = ({ session }: SessionCardProps) => {
  const { _id, createdAt, userAgent, isCurrent } = session;

  const { deleteSession, isPending } = useDeleteSession(_id);

  const handleSessionDelete = () => {
    deleteSession();
  }

  return (
    <Flex p={3} borderWidth="1px" borderRadius="md">
      <Box flex={1}>
        <Text fontWeight="bold" fontSize="sm" mb={1} color="yellow">
          {new Date(createdAt).toLocaleString("en-US")}
          {isCurrent && " (current session)"}
        </Text>
        <Text color="gray.300" fontSize="xs">
          {userAgent}
        </Text>
      </Box>
      {!isCurrent && (
        <Button
          size="sm"
          variant="ghost"
          ml={4}
          alignSelf="center"
          fontSize="xl"
          color="red.400"
          title="Delete Session"
          onClick={handleSessionDelete}
          loading={isPending}
        >
          &times;
        </Button>
      )}
    </Flex>
  );
};
export default SessionCard;
