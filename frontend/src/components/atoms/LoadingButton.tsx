import LoadingButton from '@mui/lab/LoadingButton';

interface Props {
	buttonColor?: string;
}
/** A Button page */
const CustomLoadingButton = (props: Props) => {
	return (
		<LoadingButton
			variant='contained'
			loading
			style={{
				backgroundColor: props.buttonColor,
			}}
		/>
	);
};

export default CustomLoadingButton;
