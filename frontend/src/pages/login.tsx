import LoginForm from '@/components/molecules/LoginForm';
import React from 'react';
import WelcomeTemplate from '@/components/templates/WelcomeTemplate';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/utils/AuthContext';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/utils/firebase';

/** A Login page */
const Login = () => {
	const { user } = useAuth();
	const router = useRouter();
	useEffect(() => {
		const unsub = onAuthStateChanged(auth, (authUser) => {
			if (authUser) {
				router.replace('/');
			}
		});
		return unsub;
	}, [user]);
	return (
		<>
			<WelcomeTemplate Form={LoginForm} />
		</>
	);
};

export default Login;
