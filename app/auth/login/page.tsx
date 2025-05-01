import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Logo from "@/components/blocks/Logo";
import SignInWithGithub from "@/components/auth/SignInWithGithub";
import SignInWithMagicLink from "@/components/auth/SignInWithMagicLink";
import { getMetrics } from "@/config/landing-page-config";


const LoginForm = async () => {
  const metrics = await getMetrics();
  // Read the GitHubLogin from environment variables.
  const enableGitLogin = process.env.NEXT_PUBLIC_ENABLE_GITHUB_LOGIN === "true";

  return (
    <div className="themes-wrapper bg-background w-ful h-screen flex flex-col items-center justify-center px-4">
      <div className="flex justify-center mb-8">
        <Logo />
      </div>
      <Card className="mx-auto max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Crea una Cuenta</CardTitle>
          <CardDescription>
            Introduzca un email para crear una cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>

          {/* Mostrar iframe si active users (metrics[3]) es mayor a 3 */}
          {Number(metrics[2].value) > 100 ? (
            <iframe
              src="https://waitfast.netlify.app/embed/waitlist/tu_wait_list?theme=light&size=md"
              style={{ border: 'none', width: '100%', height: '500px' }}
              title="[on]MMaTeX Waitlist"
            ></iframe>
          ):(
          <div className="grid gap-4">

            <SignInWithMagicLink />

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
               {enableGitLogin &&( <span className="bg-background px-2 text-muted-foreground">
                  O continuar con
                </span>
               )}
              </div>
            </div>
            {enableGitLogin &&(
              <SignInWithGithub />
            )}
          </div>

          )}

          {/*<p className="mt-4 px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>
          </p>*/}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
