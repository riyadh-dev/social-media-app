interface IUserBase {
	_id: string;
	username: string;
	password: string;
	profilePicture: string;
	followers: string[];
	followees: string[];
	isAdmin: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export type IUserDB = Omit<IUserBase, '_id' | 'createdAt' | 'updatedAt'>;
export type TJwtUser = Omit<IUserBase & { iat: string }, 'password'>;
export type TLoginInput = Pick<IUserBase, 'password' | 'username'>;
export type TSignUpInput = Pick<
	IUserBase,
	'password' | 'username' | 'profilePicture'
>;
