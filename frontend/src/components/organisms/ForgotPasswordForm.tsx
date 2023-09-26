import React from "react";
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { auth } from "@/utils/firebase";
import CustomAlert from "../atoms/CustomAlert";
import { BASE_URL_CLIENT } from "@/utils/constants";

type FormValues = {
	email: string;
};

/** A ForgotPasswordForm page */
const ForgotPasswordForm = () => {
	const [sendPasswordResetEmail, sending, error] =
		useSendPasswordResetEmail(auth);

	const [errorMessage, setErrorMessage] = React.useState<string>("");
	const [success, setSuccess] = React.useState<boolean>(false);
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<FormValues>();

	const handleErrors = (errors: any) => {
		// Firebase reset password email error codes are weird. Need to parse it
		const parsedError = errors.split("/")[1].slice(0, -2);
		console.log(parsedError);
		switch (parsedError) {
			case "invalid-email":
				return "Invalid email address format.";
			case "user-disabled":
				return "User with this email has been disabled.";
			case "user-not-found":
				return "There is no user with this email address.";
			default:
				return "Something went wrong.";
		}
	};

	const LoginErrorComponent = (): JSX.Element => {
		return (
			<div>
				{error ? (
					<CustomAlert
						severity="error"
						title="Error"
						message={handleErrors(error.message)}
					/>
				) : null}
			</div>
		);
	};

	const SuccessMessage = (): JSX.Element => {
		return (
			<div>
				{success ? (
					<CustomAlert
						severity="success"
						title="Success"
						message="Password Reset Email Sent. Please check your inbox."
					/>
				) : null}
			</div>
		);
	};

	const handleForgotPassword: SubmitHandler<FormValues> = async (data) => {
		const { email } = data;
		const actionCodeSettings = {
			url: `${BASE_URL_CLIENT}/login`,
		};

		const resetPassword = await sendPasswordResetEmail(
			email,
			actionCodeSettings
		);
		if (resetPassword) {
			setSuccess(true);
		}
		if (error) {
			console.log(error.message);
		}
		console.log(email);
	};

	return (
		<form onSubmit={handleSubmit(handleForgotPassword)} className="space-y-4">
			<LoginErrorComponent />
			<SuccessMessage />
			<div className="font-bold text-3xl">Forgot Password</div>
			<div className="text-sm">
				After verifying your email, you will receive instructions on how to
				reset your password. If you continue to experience issues, please
				contact our support team for assistance.
			</div>
			<div>
				<TextField
					requiredMessage={errors.email ? "Required" : undefined}
					name="email"
					type="email"
					register={register}
					label="Email *"
					required={true}
				/>
			</div>
			<div>
				<Button type="submit" color="dark-gray">
					Send Email
				</Button>
			</div>
			<div className="justify-center flex flex-row text-sm">
				<Link href="/" className="text-black">
					{" "}
					Reach out to support team
				</Link>
			</div>
		</form>
	);
};

export default ForgotPasswordForm;
