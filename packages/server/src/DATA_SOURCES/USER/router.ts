import { Router } from 'express';
import {
	authenticate,
	csrfLogin,
	csrfProtection,
	validateInput,
} from '../../common/middlewares';
import {
	createUser,
	deleteUser,
	follow,
	getUser,
	getUsers,
	getUsersByIds,
	login,
	logout,
	unfollow,
	updateUser,
} from './controllers';
import {
	getUsersValidationSchema,
	loginValidationSchema,
	signupValidationSchema,
	updateValidationSchema,
} from './validation';

const router = Router();

router.post('/', validateInput(signupValidationSchema), createUser);
router.post('/login', validateInput(loginValidationSchema), csrfLogin, login);
router.post('/logout', logout);
router.post('/list', validateInput(getUsersValidationSchema), getUsersByIds);
router.get('/list/:date', authenticate(), getUsers);

router.use(csrfProtection);

router.put(
	'/:id',
	authenticate(),
	validateInput(updateValidationSchema),
	updateUser
);

router.delete('/:id', authenticate(), deleteUser);

router.get('/:id', getUser);

router.put('/:id/follow', authenticate(), follow);
router.put('/:id/unfollow', authenticate(), unfollow);

export default router;
