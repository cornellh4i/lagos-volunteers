import React from 'react';
import Button from '../atoms/Button';
import TextField from '../atoms/TextField';
import CustomCheckbox from '../atoms/Checkbox';
import { useForm, SubmitHandler } from 'react-hook-form';

type FormValues = {
	email: string;
	firstName: string;
	lastName: string;
	preferredName: string;
	oldPassword: string;
	newPassword: string;
	confirmNewPassword: string;
	emailNotifications: boolean;
};

const ProfileForm = () => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<FormValues>();

	const handleChanges: SubmitHandler<FormValues> = async (data) => {
		const {
			email,
			firstName,
			lastName,
			preferredName,
			oldPassword,
			newPassword,
			confirmNewPassword,
			emailNotifications,
		} = data;
		console.log(data);
	};

	return (
		<form onSubmit={handleSubmit(handleChanges)} className='space-y-4'>
			<div>
				<TextField
					label='Email *'
					required={true}
					name='email'
					register={register}
					requiredMessage={errors.email ? 'Required' : undefined}
				/>
			</div>
			<div>
				<TextField
					label='First name *'
					required={true}
					name='firstName'
					register={register}
					requiredMessage={errors.firstName ? 'Required' : undefined}
				/>
			</div>
			<div>
				<TextField
					label='Last name *'
					required={true}
					name='lastName'
					register={register}
					requiredMessage={errors.lastName ? 'Required' : undefined}
				/>
			</div>
			<div>
				<TextField
					label='Preferred name *'
					required={true}
					name='preferredName'
					register={register}
					requiredMessage={errors.preferredName ? 'Required' : undefined}
				/>
			</div>
			<div>
				<TextField
					type='password'
					label='Old password *'
					required={false}
					name='oldPassword'
					register={register}
					requiredMessage={errors.oldPassword ? 'Required' : undefined}
				/>
			</div>
			<div>
				<TextField
					type='password'
					label='New password '
					required={false}
					name='newPassword'
					register={register}
				/>
			</div>
			<div>
				<TextField
					type='password'
					label='Confirm new password'
					required={true}
					name='confirmNewPassword'
					register={register}
					requiredMessage={
						watch('newPassword') === watch('confirmNewPassword')
							? undefined
							: 'Passwords must match'
					}
				/>
			</div>
			<div>
				<CustomCheckbox label='Email notifications' />
			</div>
			<div className='flex md:space-x-4 grid sm:grid-cols-1 md:grid-cols-2'>
				<div className='sm:pb-4 md:pb-0'>
					<Button
						type='submit'
						buttonText='Save Changes'
						buttonTextColor='#000000'
						buttonColor='#D3D3D3'
					/>
				</div>
				<div>
					<Button
						buttonText='Cancel'
						buttonTextColor='#000000'
						buttonColor='#808080'
					/>
				</div>
			</div>
		</form>
	);
};

export default ProfileForm;
