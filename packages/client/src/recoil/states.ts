import { atom } from 'recoil';
import { ITheme } from '../common/interfaces';
import { themePersistEffect } from './effects';

export const themeState = atom<ITheme>({
	key: 'themeState',
	default: {
		mode: 'light',
		isUserPicked: false,
	},
	effects_UNSTABLE: [themePersistEffect],
});
