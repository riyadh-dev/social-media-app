import Joi from 'joi';
import { isValidObjectId } from 'mongoose';

export const dbDocIdValidationSchema = Joi.string().custom((id, helpers) =>
	isValidObjectId(id) ? id : helpers.message({ custom: 'invalid userId' })
);

export const dbDocIdsValidationSchema = Joi.array()
	.items(dbDocIdValidationSchema)
	.unique()
	.required();
