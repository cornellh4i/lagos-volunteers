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
	return (
		<WelcomeTemplate>
			<LoginForm />
		</WelcomeTemplate>
	);
};

export default Login;
