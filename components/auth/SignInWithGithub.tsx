import { onSignIn } from "@/actions/auth-actions";
import { Button } from "../ui/button";
import { GithubIcon } from "lucide-react";

const SignInWithGithub = () => {
  return (
    <form action={onSignIn}>
      {/* -- Acordarse de remover ese id al final ---*/}
      <Button id="myGitHub" variant="outline" className="w-full">
        <GithubIcon className="w-4 h-4 mr-2" /> Github
      </Button>
    </form>
  );
};

export default SignInWithGithub;
