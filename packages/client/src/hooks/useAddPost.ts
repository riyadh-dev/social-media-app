import { useMutation } from 'react-query';
import { addPostQuery } from '../queries/posts';

//TODO optimistic update
const useAddPost = () => useMutation(addPostQuery);

export default useAddPost;
