import 'express-serve-static-core';
import { DB_DOC_IDS } from '../common/strings';
import { MESSAGE_INPUT } from '../DATA_SOURCES/MESSAGES/strings';
import { TMessageInput } from '../DATA_SOURCES/MESSAGES/types';
import { POST_INPUT } from '../DATA_SOURCES/POST/strings';
import { TPostInput } from '../DATA_SOURCES/POST/types';
import { POST_COMMENT_INPUT } from '../DATA_SOURCES/POST_COMMENT/strings';
import { TPostCommentInput } from '../DATA_SOURCES/POST_COMMENT/types';
import {
	LOGIN_INPUT,
	SIGNUP_INPUT,
	UPDATE_USER_INPUT,
} from '../DATA_SOURCES/USER/strings';
import {
	TLoginInput,
	TSignUpInput,
	TUpdateUserInput,
} from '../DATA_SOURCES/USER/types';

declare module 'express-serve-static-core' {
	interface Request {
		currentUserId?: string;
		[LOGIN_INPUT]?: TLoginInput;
		[SIGNUP_INPUT]?: TSignUpInput;
		[UPDATE_USER_INPUT]?: TUpdateUserInput;
		[MESSAGE_INPUT]?: TMessageInput;
		[POST_INPUT]?: TPostInput;
		[POST_COMMENT_INPUT]?: TPostCommentInput;
		[DB_DOC_IDS]?: string[];
	}
}
