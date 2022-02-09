import { atom } from 'recoil';
import { ICurrentUser, ITheme } from '../common/interfaces';
import { currentUserPersistEffect, themePersistEffect } from './effects';

export const themeState = atom<ITheme>({
	key: 'themeState',
	default: {
		mode: 'light',
		isUserPicked: false,
	},
	effects_UNSTABLE: [themePersistEffect],
});

export const currentUserState = atom<ICurrentUser | null>({
	key: 'currentUserState',
	default: null,
	effects_UNSTABLE: [currentUserPersistEffect],
});

export const sideBarOpenState = atom({
	key: 'sideBarOpenState',
	default: false,
});
