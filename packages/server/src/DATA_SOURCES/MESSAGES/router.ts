import { Router } from 'express';
import { authenticate, validateInput } from '../../common/middlewares';
import { dbDocIdsValidationSchema } from '../../common/validation';
import { createMessage, getMessagesByConversationMembers } from './controllers';
import { createMessageValidationSchema } from './validation';

const messagesRouter = Router();

messagesRouter.post(
	'/',
	authenticate,
	validateInput(createMessageValidationSchema, 'messageInput'),
	createMessage
);

messagesRouter.post(
	'/conversation',
	authenticate,
	validateInput(dbDocIdsValidationSchema, 'dBDocIds'),
	getMessagesByConversationMembers
);

export default messagesRouter;
