import { Router } from 'express';
import {
	authenticate,
	csrfLogin,
	csrfProtection,
	validateInput,
} from '../../common/middlewares';
import { dbDocIdsValidationSchema } from '../../common/validation';
import {
	deleteUser,
	getUsers,
	getUsersByIds,
	login,
	logout,
	signup,
	updateUser,
} from './controllers';
import {
	loginValidationSchema,
	signupValidationSchema,
	updateValidationSchema,
} from './validation';

const router = Router();

router.post('/', validateInput(signupValidationSchema, 'signupInput'), signup);
router.post(
	'/login',
	validateInput(loginValidationSchema, 'loginInput'),
	csrfLogin,
	login
);
router.post('/logout', logout);
router.post(
	'/list',
	validateInput(dbDocIdsValidationSchema, 'dBDocIds'),
	getUsersByIds
);
router.get('/list/:date', authenticate(), getUsers);

router.use(csrfProtection);

router.put(
	'/:id',
	authenticate(),
	validateInput(updateValidationSchema, 'updateUserInput'),
	updateUser
);

router.delete('/:id', authenticate(), deleteUser);

export default router;
