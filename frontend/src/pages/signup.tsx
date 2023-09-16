import React from 'react';
import WelcomeTemplate from '@/components/templates/WelcomeTemplate';
import SignupForm from '@/components/organisms/SignupForm';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/utils/AuthContext';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/utils/firebase';

/** A Signup page */
const Signup = () => {
	return (
		<WelcomeTemplate>
			<SignupForm />
		</WelcomeTemplate>
	);
};

export default Signup;
