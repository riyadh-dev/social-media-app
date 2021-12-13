import dotenv from 'dotenv';
import fs from 'fs';

if (fs.existsSync('.env')) {
	console.log('Using .env file to supply config environment variables');
	dotenv.config({ path: '.env' });
} else if (fs.existsSync('.env.example')) {
	console.log('Using .env.example file to supply config environment variables');
	dotenv.config({ path: '.env.example' });
} else {
	console.log('No ENV file was provided');
	process.exit(1);
}

export const IS_PROD = process.env.NODE_ENV === 'production';
export const MONGODB_URI = process.env['MONGODB_URI'] ?? '';
export const PORT = process.env['PORT'] ?? '';

if (!MONGODB_URI) {
	console.error(
		'No mongodb connection string. Set MONGODB_URI environment variable.'
	);
	process.exit(1);
}
if (!PORT) {
	console.error('No server port. Set SERVER_PORT environment variable.');
	process.exit(1);
}
