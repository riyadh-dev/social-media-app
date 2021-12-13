import { Router } from 'express';
import { validateInput } from '../common/middlewares';
import { createUser } from './controllers';
import { signupValidationSchema } from './validation';

const router = Router();

router.get('/', (req, res) => {
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

router.post('/auth', (req, res) => {
	res.send('login a user:\n' + req.body);
});

export default router;
