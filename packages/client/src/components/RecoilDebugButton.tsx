import { Avatar } from '@mui/material';
import { useRecoilCallback } from 'recoil';

const RecoilDebugButton = () => {
	const onClick = useRecoilCallback(
		({ snapshot }) =>
			async () => {
				console.debug('Atom values:');
				Array.from(snapshot.getNodes_UNSTABLE()).forEach(async (node) => {
					const value = await snapshot.getPromise(node);
					console.debug(node.key, value);
				});
			},
		[]
	);

	return (
		<Avatar
			sx={{
				position: 'fixed',
				cursor: 'pointer',
				left: 64,
				bottom: 12,
				zIndex: 99999,
				opacity: 0.5,
			}}
			src='https://recoiljs.org/img/favicon.png'
			onClick={onClick}
		/>
	);
};

export default RecoilDebugButton;
