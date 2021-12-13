export default interface IUser {
	username: string;
	password: string;
	profilePicture: string;
	followers: string[];
	followees: string[];
	isAdmin: boolean;
}
