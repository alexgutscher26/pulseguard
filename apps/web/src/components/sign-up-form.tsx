import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import Loader from "./loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function SignUpForm({ onSwitchToSignIn }: { onSwitchToSignIn: () => void }) {
  const router = useRouter();
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
        },
        {
          onSuccess: () => {
            router.push("/dashboard");
            toast.success("Sign up successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div>
          <form.Field name="name">
            {(field) => (
              <div className="space-y-2">
                <Label
                  htmlFor={field.name}
                  className="text-xs uppercase tracking-widest text-primary/70 font-mono"
                >
                  Operator Identity
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder="ex: User_V1"
                  className="bg-black/50 border-primary/30 text-primary placeholder:text-primary/30 focus-visible:ring-primary/50 font-mono h-12"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500 font-mono text-xs mt-1">
                    {">"} {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <Label
                  htmlFor={field.name}
                  className="text-xs uppercase tracking-widest text-primary/70 font-mono"
                >
                  Email Command
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  placeholder="usr@pulseguard.io"
                  className="bg-black/50 border-primary/30 text-primary placeholder:text-primary/30 focus-visible:ring-primary/50 font-mono h-12"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500 font-mono text-xs mt-1">
                    {">"} {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="password">
            {(field) => (
              <div className="space-y-2">
                <Label
                  htmlFor={field.name}
                  className="text-xs uppercase tracking-widest text-primary/70 font-mono"
                >
                  Access Key
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  placeholder="••••••••"
                  className="bg-black/50 border-primary/30 text-primary placeholder:text-primary/30 focus-visible:ring-primary/50 font-mono h-12"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500 font-mono text-xs mt-1">
                    {">"} {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <form.Subscribe>
          {(state) => (
            <Button
              type="submit"
              className="w-full bg-primary text-black font-mono font-bold uppercase tracking-widest hover:bg-primary/90 transition-all border border-primary h-12 mt-6"
              disabled={!state.canSubmit || state.isSubmitting}
            >
              {state.isSubmitting ? "Processing..." : "Initiate Registration"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="text-center pt-2 border-t border-primary/10">
        <Button
          variant="link"
          onClick={onSwitchToSignIn}
          className="text-muted-foreground hover:text-primary font-mono text-xs uppercase tracking-widest"
        >
          Existing Operator? Execute Login
        </Button>
      </div>
    </div>
  );
}
