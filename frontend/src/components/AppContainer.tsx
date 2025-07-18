import { Box, Center, Spinner } from "@chakra-ui/react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import UserMenu from "./UserMenu";
import { UserContext } from "@/contexts/UserContext";

const AppContainer = () => {
  const { user, isLoading } = useAuth();

  return isLoading ? (
    <Center w="100vw" h="90vh" flexDir="column">
      <Spinner mb={4} />
    </Center>
  ) : user ? (
    <UserContext.Provider value={{ user }}>
      <Box p={4} minH="100vh" bg={"#0f172a"}>
        <UserMenu />
        <Outlet />
      </Box>
    </UserContext.Provider>
  ) : (
    <Navigate
      to="/login"
      replace
      state={{
        // It will redirect the user to the page he was looking for after successful login.
        redirectUrl: window.location.pathname,
      }}
    />
  );
};
export default AppContainer;
