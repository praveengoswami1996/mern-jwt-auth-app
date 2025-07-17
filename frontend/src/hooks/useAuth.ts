import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/lib/api";

export const AUTH = "auth";

// interface UserData {
//   _id: string;
//   email: string;
//   verified: boolean;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

const useAuth = (opts = {}) => {
  const { data: user, ...rest } = useQuery({
    queryKey: [AUTH],
    queryFn: getUser,
    staleTime: Infinity,
    ...opts,
  });

  return {
    user,
    ...rest,
  };
};

export default useAuth;
