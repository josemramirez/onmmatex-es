import { CircleUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SignOut from "../auth/SignOut";
import { auth } from "@/services/auth";
import Link from "next/link";
import { unauthRedirectTo } from "@/config/auth-config";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { userProfileLinks } from "@/config/menu-config";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

{/* -- Acordarse de remover ese id al final ---*/}
const UserProfile = async () => {
  const session = await auth();
  if (!session?.user) {
    return (
      <Button asChild variant="default">
        <Link href={unauthRedirectTo}>Comenzar</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage
              alt="avatar"
              src={session.user.image!}
              className="p-1"
            />
            <AvatarFallback>
              <CircleUser className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>

          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {userProfileLinks.map(({ label, url, icon, isAdmin }, i) => {
          // Check if the link should be display for admin
          const shouldDisplayLink =
            !isAdmin || (isAdmin && session.user?.email === ADMIN_EMAIL);

          if (!shouldDisplayLink) return null; // Don't render this link
          const Icon = icon;

          return (
            <Link key={i} href={url}>
              <DropdownMenuItem>
                {Icon && <Icon className="h-4 w-4 mr-2" />}
                <span>{label}</span>
              </DropdownMenuItem>
            </Link>
          );
        })}
        <DropdownMenuSeparator />
        <SignOut />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
