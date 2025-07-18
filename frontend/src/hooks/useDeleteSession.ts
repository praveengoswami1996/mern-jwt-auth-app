import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSession, type Session } from "../lib/api";
import { SESSIONS } from "./useSessions";

const useDeleteSession = (sessionId: string) => {
  const queryClient = useQueryClient();
  const { mutate, ...rest } = useMutation({
    mutationFn: () => deleteSession(sessionId),
    onSuccess: () => {
      queryClient.setQueryData([SESSIONS], (cache: Session[]) =>
        cache.filter((session) => session._id !== sessionId)
      );
    },
  });

  return { deleteSession: mutate, ...rest };
};

export default useDeleteSession;
