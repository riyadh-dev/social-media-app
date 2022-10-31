import { IPost } from '@social-media-app/shared';

export type TPostInput = Pick<IPost, 'img' | 'description'>;
