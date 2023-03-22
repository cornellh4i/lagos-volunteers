import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { firebaseConfig } from '@/config/firebaseconfig';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
