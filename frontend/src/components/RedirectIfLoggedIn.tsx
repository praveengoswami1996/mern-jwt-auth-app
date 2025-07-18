
import useAuth from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

interface RedirectIfLoggedInProps {
  children: React.ReactNode;
}

const RedirectIfLoggedIn = ({ children }: RedirectIfLoggedInProps) => {
  const { user } = useAuth();

  if(user) {
    return (
        <Navigate 
            to={"/"}
        />
    )
  }

  return <>{children}</>;
};

export default RedirectIfLoggedIn;
