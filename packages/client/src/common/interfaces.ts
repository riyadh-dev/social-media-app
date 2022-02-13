import { PaletteMode } from '@mui/material';

export interface ITheme {
	mode: PaletteMode;
	isUserPicked: boolean;
}

export interface ILoginInput {
	username: string;
	password: string;
}

export interface ICurrentUser {
	_id: string;
	username: string;
	profilePicture: string;
	followers: string[];
	followings: string[];
	likedPosts: string[];
	dislikedPosts: string[];
	isAdmin: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface IPost {
	_id: string;
	author: string;
	description: string;
	img: string;
	likes: string[];
	dislikes: string[];
	createdAt: string;
	updatedAt: string;
}
