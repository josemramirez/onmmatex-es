import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { onLogut } from "@/actions/auth-actions";

const SignOut = () => {
  return (
    <DropdownMenuItem asChild>
      <form action={onLogut}>
        <button type="submit" className="flex items-center">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </button>
      </form>
    </DropdownMenuItem>
  );
};

export default SignOut;
