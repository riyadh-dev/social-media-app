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

export const chatBoxState = atom({
	key: 'chatBoxState',
	default: {
		minimized: new Map<string, Omit<ICurrentUser, 'csrfToken'>>(),
		open: new Map<string, Omit<ICurrentUser, 'csrfToken'>>(),
	},
});
