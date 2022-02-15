export const isUniqueInArray = (
	element: unknown,
	index: number,
	array: unknown[]
) => {
	return array.indexOf(element) === index;
};
