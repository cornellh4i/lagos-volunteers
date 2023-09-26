import React from "react";
import WelcomeTemplate from "@/components/templates/WelcomeTemplate";
import SignupForm from "@/components/organisms/SignupForm";

/** A Signup page */
const Signup = () => {
	return (
		<WelcomeTemplate>
			<SignupForm />
		</WelcomeTemplate>
	);
};

export default Signup;
