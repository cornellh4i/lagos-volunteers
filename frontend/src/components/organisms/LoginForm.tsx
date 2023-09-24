import React, { useState } from 'react';
import Divider from '@mui/material/Divider';
import Button from '../atoms/Button';
import TextField from '../atoms/TextField';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuth } from '@/utils/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { auth } from '@/utils/firebase';
import CustomAlert from '../atoms/CustomAlert';

import {
	useSignInWithEmailAndPassword,
	useSignInWithGoogle,
} from 'react-firebase-hooks/auth';

export type FormValues = {
	email: string;
	password: string;
};

const LoginForm = () => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const [
		signInWithEmailAndPassword,
		signedInUser,
		signInLoading,
		signInErrors,
	] = useSignInWithEmailAndPassword(auth);

	// Sign in With Google
	const [signInWithGoogle, googleUser, googleLoading, googleError] =
		useSignInWithGoogle(auth);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<FormValues>();

	const handleErrors = (errors: any) => {
		switch (errors) {
			case 'auth/invalid-email':
				return 'Invalid email address format.';
			case 'auth/user-disabled':
				return 'User with this email has been disabled.';
			case 'auth/user-not-found':
				return 'There is no user with this email address.';
			case 'auth/wrong-password':
				return 'Invalid email or password.';
			case 'auth/too-many-requests':
				return 'You have made too many requests to login. Please try again later.';
			default:
				return 'Something went wrong.';
		}
	};

	const LoginErrorComponent = (): JSX.Element => {
		return (
			<div>
				{signInErrors ? (
					<CustomAlert
						severity='error'
						title='Error'
						message={handleErrors(signInErrors.code)}
					/>
				) : null}
			</div>
		);
	};

	const handleGoogleLogin = async () => {
		setIsLoading(true);
		try {
			await signInWithGoogle();
			if (googleUser) {
				router.push('/events/view');
			}
		} catch (err) {}
		setIsLoading(false);
	};

	const handleLogin: SubmitHandler<FormValues> = async (data) => {
		setIsLoading(true);
		const { email, password } = data;

		try {
			await signInWithEmailAndPassword(email, password);
			if (signedInUser) {
				router.push('/events/view');
			}
		} catch (err) {}
		setIsLoading(false);
	};

	return (
		<div className='space-y-4 '>
			<LoginErrorComponent />
			<form onSubmit={handleSubmit(handleLogin)} className='space-y-4 '>
				<div className='font-bold text-3xl'> Log In </div>
				<div>
					<TextField
						requiredMessage={errors.email ? 'Required' : undefined}
						label='Email *'
						name='email'
						type='email'
						register={register}
						required={true}
					/>
				</div>
				<div>
					<TextField
						requiredMessage={errors.password ? 'Required' : undefined}
						label='Password *'
						name='password'
						type='password'
						register={register}
						required={true}
					/>
				</div>
				<div className='text-center'>
					<Link href='/password/forgot' className='text-black'>
						Forgot Password?
					</Link>
				</div>
				<div>
					<Button isLoading={isLoading} type='submit' color='dark-gray'>
						Log In
					</Button>
				</div>
				<div>
					<Divider>or</Divider>
				</div>
			</form>
			<div>
				<Button
					isLoading={googleLoading}
					disabled={googleLoading}
					onClick={() => handleGoogleLogin()}
					type='submit'
					color='gray'>
					Continue with Google
				</Button>
			</div>
			<div>
				<Link href='/signup'>
					<Button type='submit' color='gray'>
						Sign up with Email
					</Button>
				</Link>
			</div>
		</div>
	);
};

export default LoginForm;
