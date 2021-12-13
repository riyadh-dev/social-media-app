import { Router } from 'express';

const userRouter = Router();

userRouter.get('/get', (req, res) => {
	res.send('user route');
});

userRouter.post('/auth', (req, res) => {
	res.send('user route');
});

export default userRouter;
