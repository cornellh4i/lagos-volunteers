import '../styles/globals.css';
import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/material/styles';
import Layout from '@/components/Layout';
import { AuthProvider } from '@/utils/AuthContext';
import { useAuth } from '@/utils/AuthContext';
import { useRouter } from 'next/router';
import LoginForm from '@/components/molecules/LoginForm';
import WelcomeTemplate from '@/components/templates/WelcomeTemplate';
import { auth } from '@/utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const theme = createTheme({
	palette: {
		primary: {
			main: '#556cd6',
		},
		secondary: {
			main: '#19857b',
		},
		error: {
			main: '#ff0000',
		},
		background: {
			default: '#fff',
		},
	},
});

const App = ({ Component, pageProps }: AppProps) => {
	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<AuthProvider>
					<Layout>
						<Component {...pageProps} />
					</Layout>
				</AuthProvider>
			</ThemeProvider>
		</StyledEngineProvider>
	);
};

export default App;
