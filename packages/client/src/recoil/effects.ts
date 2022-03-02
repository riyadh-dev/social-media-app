import axios from 'axios';
import { AtomEffect } from 'recoil';
import { ICurrentUser, ITheme } from '../common/interfaces';

export const themePersistEffect: AtomEffect<ITheme> = ({ setSelf, onSet }) => {
	const savedValue = localStorage.getItem('themeState');
	if (savedValue != null) {
		setSelf(JSON.parse(savedValue));
	}

	onSet((newValue, _, isReset) => {
		isReset
			? localStorage.removeItem('themeState')
			: localStorage.setItem('themeState', JSON.stringify(newValue));
	});
};

export const currentUserPersistEffect: AtomEffect<ICurrentUser | null> = ({
	setSelf,
	onSet,
}) => {
	const savedValue = localStorage.getItem('currentUserState');
	if (savedValue != null) {
		setSelf(JSON.parse(savedValue));
		axios.defaults.headers.common['csrf-token'] =
			JSON.parse(savedValue).csrfToken;
	}

	onSet((newValue, _, isReset) => {
		isReset
			? localStorage.removeItem('currentUserState')
			: localStorage.setItem('currentUserState', JSON.stringify(newValue));
	});
};
