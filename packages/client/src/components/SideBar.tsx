import MailIcon from '@mui/icons-material/Mail';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import React from 'react';

const DRAWER_WIDTH = 360;

interface Props {
	window?: () => Window;
}
const SideBar = (props: Props) => {
	const { window } = props;
	const [mobileOpen, setMobileOpen] = React.useState(false);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const drawer = (
		<div>
			<Toolbar />
			<Divider />
			<List>
				{[
					'Inbox',
					'Starred',
					'Send email',
					'Drafts',
					'All mail',
					'Trash',
					'Spam',
				].map((text, index) => (
					<ListItem button key={text}>
						<ListItemIcon>
							{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
						</ListItemIcon>
						<ListItemText primary={text} />
					</ListItem>
				))}
			</List>
		</div>
	);

	const container =
		window !== undefined ? () => window().document.body : undefined;

	return (
		<Box sx={{ display: 'flex' }}>
			<Box
				component='nav'
				sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
				aria-label='mailbox folders'
			>
				<Drawer
					container={container}
					variant='temporary'
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true,
					}}
					sx={{
						display: { xs: 'block', md: 'none' },
						'& .MuiDrawer-paper': {
							boxSizing: 'border-box',
							width: DRAWER_WIDTH,
						},
					}}
				>
					{drawer}
				</Drawer>

				<Drawer
					variant='permanent'
					sx={{
						display: { xs: 'none', md: 'block' },
						width: DRAWER_WIDTH,
						flexShrink: 0,
						[`& .MuiDrawer-paper`]: {
							width: DRAWER_WIDTH,
							boxSizing: 'border-box',
						},
					}}
				>
					{drawer}
				</Drawer>
			</Box>
		</Box>
	);
};

export default SideBar;
