import { Router } from 'express';
import {
	authenticate,
	csrfLogin,
	csrfProtection,
	validateInput,
} from '../common/middlewares';
import {
	createUser,
	deleteUser,
	getUser,
	login,
	logout,
	updateUser,
} from './controllers';
import {
	loginValidationSchema,
	signupValidationSchema,
	updateValidationSchema,
} from './validation';

const router = Router();

router.post('/', validateInput(signupValidationSchema), createUser);
router.post('/login', validateInput(loginValidationSchema), csrfLogin, login);
router.post('/logout', logout);

router.use(csrfProtection);

router.put(
	'/:id',
	authenticate(true),
	validateInput(updateValidationSchema),
	updateUser
);

router.put(
	'/',
	authenticate(),
	validateInput(updateValidationSchema),
	updateUser
);

router.delete('', authenticate(true), deleteUser);
router.delete('/:id', authenticate(), deleteUser);
router.get('/:id', getUser);

export default router;
