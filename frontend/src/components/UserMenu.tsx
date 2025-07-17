import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
  Portal,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "@/lib/api";

const UserMenu = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: signOut } = useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear(); // Clear the user cache
      navigate("/login", { replace: true });
    },
  });

  return (
    <MenuRoot positioning={{ placement: "right-start" }}>
      <MenuTrigger rounded="full" focusRing="outside">
        <AvatarRoot size={"lg"} cursor="pointer">
          <AvatarFallback name="Segun Adebayo" />
          <AvatarImage src="https://bit.ly/sage-adebayo" />
        </AvatarRoot>
      </MenuTrigger>
      <Portal>
        <MenuPositioner>
          <MenuContent>
            <MenuItem key={"profile"} value={"profile"} asChild>
              <Link to="/">Profile</Link>
            </MenuItem>
            <MenuItem key={"settings"} value={"settings"} asChild>
              <Link to="/settings">Settings</Link>
            </MenuItem>
            <MenuItem value="logout" onSelect={signOut}>
              Logout
            </MenuItem>
          </MenuContent>
        </MenuPositioner>
      </Portal>
    </MenuRoot>
  );
};
export default UserMenu;