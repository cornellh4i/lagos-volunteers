import React from 'react';
import Divider from '@mui/material/Divider';
import Button from '../atoms/Button';
import TextField from '../atoms/TextField';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuth } from '@/utils/AuthContext';
import { useRouter } from 'next/router';

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
			router.push('/');
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='space-y-4 '>
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
				<div className='text-center underline'>Forgot Password?</div>
				<div>
					<Button
						type='submit'
						buttonText='Log In'
						buttonTextColor='#000000'
						buttonColor='#808080'
					/>
				</div>
				<div>
					<Divider>or</Divider>
				</div>
			</form>
			<div>
				<Button
					type='submit'
					buttonText='Sign up with Email'
					buttonTextColor='#000000'
					buttonColor='#D3D3D3'
				/>
			</div>
			<div>
				<Button
					type='submit'
					buttonText='Continue with Google'
					buttonTextColor='#000000'
					buttonColor='#D3D3D3'
				/>
			</div>
		</div>
	);
};

export default LoginForm;
