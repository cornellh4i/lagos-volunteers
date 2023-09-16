import LoginForm from '@/components/organisms/LoginForm';
import React from 'react';
import WelcomeTemplate from '@/components/templates/WelcomeTemplate';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/utils/AuthContext';
import { SubmitHandler } from 'react-hook-form';
import { FormValues } from '@/components/organisms/LoginForm';

/** A Login page */
const Login = () => {
	const { signInUser } = useAuth();
	const router = useRouter();

	// Log a user in
	const handleLogin: SubmitHandler<FormValues> = async (data) => {
		try {
			await signInUser(data.email, data.password);
			router.replace('/events/view');
		} catch (error) {
			console.log(error);
		}
	};
	const handleFormDataSubmission = (data: FormValues) => {
		handleLogin(data);
	};

	return (
		<WelcomeTemplate>
			<LoginForm onFormSubmission={handleFormDataSubmission} />
		</WelcomeTemplate>
	);
};

export default Login;
