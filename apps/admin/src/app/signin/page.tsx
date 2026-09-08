import { signIn } from "../../server/auth";

export default function Page() {
  return (
    <div>
      <form
        action={async () => {
          "use server";
          await signIn("github", { redirectTo: "/" });
        }}
      >
        <button type="submit">Sign in with GitHub</button>
      </form>

      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/" });
        }}
      >
        <button type="submit">Sign in with Google</button>
      </form>
    </div>
  );
}