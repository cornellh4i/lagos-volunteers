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
	const { user, loading, signInUser } = useAuth();
	const [isLogged, setIsLogged] = useState(false);
	const router = useRouter();

	// // Login should happen on page level
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

	// If you are already logged in, redirect to the home page
	useEffect(() => {
		if (user) {
			setIsLogged(true);
			router.push('/events/view');
		} else {
			setIsLogged(false);
		}
	}, [user, loading]);

	if (user || loading) {
		return <div>Loading...</div>;
	}

	return (
		<WelcomeTemplate>
			<LoginForm onFormSubmission={handleFormDataSubmission} />
		</WelcomeTemplate>
	);
};

export default Login;
