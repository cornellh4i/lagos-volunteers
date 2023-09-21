import React, { useState, useEffect } from 'react';
import Button from '../atoms/Button';
import TextField from '../atoms/TextField';
import Link from 'next/link';
import { useAuth } from '@/utils/AuthContext';
import { auth } from '@/utils/firebase';
import { BASE_URL } from '@/utils/constants';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import CustomAlert from '../atoms/CustomAlert';
import { useRouter } from 'next/router';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';

type FormValues = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
};

const SignupForm = () => {
	const [
		createUserWithEmailAndPassword,
		createdUser,
		createdUserLoading,
		createdUserErrors,
	] = useCreateUserWithEmailAndPassword(auth);
	const [
		signInWithEmailAndPassword,
		signedInUser,
		signInLoading,
		signInErrors,
	] = useSignInWithEmailAndPassword(auth);
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<FormValues>();

	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleErrors = (errors: any) => {
		// Firebase create user errors
		switch (errors) {
			case 'auth/email-already-exists':
				return 'Email already in use. Please choose another email.';
			case 'auth/invalid-email':
				return 'Invalid email address format.';
			case 'auth/invalid-password':
				return 'Password should be at least 6 characters.';
			default:
				return 'Something went wrong trying to create your account. Please try again.';
		}
	};

	const SignUpErrorComponent = (): JSX.Element => {
		return (
			<div>
				{errorMessage ? (
					<CustomAlert
						severity='error'
						title='Error'
						message={handleErrors(errorMessage)}
					/>
				) : null}
			</div>
		);
	};

	const handleSubmitUser: SubmitHandler<FormValues> = async (data, event) => {
		setIsLoading(true);

		event?.preventDefault(); // do we need this though?
		const { firstName, lastName, email, password } = data;
		const emailLowerCase = email.toLowerCase();
		const post = {
			email: emailLowerCase,
			profile: {
				firstName,
				lastName,
			},
			password,
		};

		try {
			if (password != data.confirmPassword) {
				return;
			}

			const response = await fetch(`${BASE_URL}/users`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(post),
			});
			const r = await response.json();
			console.log(r);
			if (response.ok) {
				const signIn = await signInWithEmailAndPassword(email, password);
				if (signIn?.user) {
					router.replace('/events/view');
				}
				setIsLoading(false);
			} else {
				setErrorMessage(r.error);
			}
		} catch (error: any) {
			setErrorMessage(error.message);
		}
		setIsLoading(false);

		// Remeber handling errors for mismatched signup credentials
	};

	return (
		<form onSubmit={handleSubmit(handleSubmitUser)} className='space-y-4'>
			<SignUpErrorComponent />
			<div className='font-bold text-3xl'>Sign Up</div>
			<div>
				<TextField
					requiredMessage={errors.email ? 'Required' : undefined}
					name='email'
					type='email'
					register={register}
					label='Email *'
					required={true}
				/>
			</div>
			<div className='grid sm:space-x-4 grid-cols-1 sm:grid-cols-2 '>
				<div className='pb-4 sm:pb-0'>
					<TextField
						requiredMessage={errors.firstName ? 'Required' : undefined}
						name='firstName'
						register={register}
						label='First Name *'
						required={true}
					/>
				</div>
				<div>
					<TextField
						requiredMessage={errors.lastName ? 'Required' : undefined}
						name='lastName'
						register={register}
						label='Last Name *'
						required={true}
					/>
				</div>
			</div>
			<div>
				<TextField
					requiredMessage={errors.password ? 'Required' : undefined}
					type='password'
					name='password'
					register={register}
					label='Password *'
					required={true}
				/>
			</div>
			<div>
				<TextField
					type='password'
					requiredMessage={
						errors.confirmPassword
							? 'Required'
							: watch('password') != watch('confirmPassword')
							? 'Passwords do not match'
							: undefined
					}
					name='confirmPassword'
					register={register}
					label='Confirm Password *'
					required={true}
				/>
			</div>
			<div>
				<Button isLoading={isLoading} color='dark-gray' type='submit'>
					Continue
				</Button>
			</div>
			<div>
				<Button type='submit' color='gray'>
					Continue with Google
				</Button>
			</div>
			<div className='justify-center flex flex-row'>
				<div className=''>Have an account?&nbsp;</div>
				<Link href='/login' className='text-black'>
					{' '}
					Log in
				</Link>
			</div>
		</form>
	);
};

export default SignupForm;
