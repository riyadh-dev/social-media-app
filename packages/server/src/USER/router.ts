import { Router } from 'express';
import { authenticate, csrfLogin, validateInput } from '../common/middlewares';
import { createUser, login, logout } from './controllers';
import { loginValidationSchema, signupValidationSchema } from './validation';

const router = Router();

router.get('/', authenticate(), (req, res) => {
	res.send('list of users');
});

router.get('/:id', (req, res) => {
	res.send('add user with id: ' + req.params.id);
});

router.post('/', validateInput(signupValidationSchema), createUser);

router.put('/:id', (req, res) => {
	res.send('update user with id: ' + req.params.id);
});

router.delete('/:id', (req, res) => {
	res.send('delete user with id: ' + req.params.id);
});

router.post('/login', validateInput(loginValidationSchema), csrfLogin, login);
router.post('/logout', logout);

export default router;
