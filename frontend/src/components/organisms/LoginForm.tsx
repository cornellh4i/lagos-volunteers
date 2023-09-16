import React from "react";
import Divider from "@mui/material/Divider";
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "@/utils/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";

type FormValues = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const { signInUser } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const handleLogin: SubmitHandler<FormValues> = async (data) => {
    const { email, password } = data;
    try {
      await signInUser(email, password);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-4 ">
      <form onSubmit={handleSubmit(handleLogin)} className="space-y-4 ">
        <div className="font-bold text-3xl"> Log In </div>
        <div>
          <TextField
            requiredMessage={errors.email ? "Required" : undefined}
            label="Email *"
            name="email"
            type="email"
            register={register}
            required={true}
          />
        </div>
        <div>
          <TextField
            requiredMessage={errors.password ? "Required" : undefined}
            label="Password *"
            name="password"
            type="password"
            register={register}
            required={true}
          />
        </div>
        <div className="text-center">
          <Link href="/password/forgot" className="text-black">
            Forgot Password?
          </Link>
        </div>
        <div>
          <Button type="submit" color="dark-gray">
            Log In
          </Button>
        </div>
        <div>
          <Divider>or</Divider>
        </div>
      </form>
      <div>
        <Link href="/signup">
          <Button type="submit" color="gray">
            Sign up with Email
          </Button>
        </Link>
      </div>
      <div>
        <Button type="submit" color="gray">
          Continue with Google
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
