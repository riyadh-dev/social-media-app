import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import router from './USER/router';

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(morgan('common'));

app.get('/api', (req, res) => {
	res.send('Hello World!');
});

app.use('/api/users', router);

app.use(express.static(path.join(__dirname, '../../client/build')));
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

export default app;
