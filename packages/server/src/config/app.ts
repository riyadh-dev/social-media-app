import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { csrfProtection, handlePassedError } from '../common/middlewares';
import { CLIENT_ORIGIN, COOKIE_SECRET } from './secrets';
import postRouter from '../DATA_SOURCES/POST/router';
import postsCommentRouter from '../DATA_SOURCES/POST_COMMENT/router';
import userRouter from '../DATA_SOURCES/USER/router';

const app = express();

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cookieParser(COOKIE_SECRET));
app.use(express.json());
app.use(morgan('common'));

app.get('/api', (req, res) => {
	res.send('Hello World!');
});

app.use('/api/users', userRouter);
app.use(csrfProtection);
app.use('/api/posts/comments', postsCommentRouter);
app.use('/api/posts', postRouter);

app.use(express.static(path.join(__dirname, '../../client/build')));
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

app.use(handlePassedError);

export default app;
