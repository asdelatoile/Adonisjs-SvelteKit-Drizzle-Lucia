import vine from '@vinejs/vine';

export const schema = vine.object({
	email: vine.string().trim().email(),
	password: vine.string().minLength(8)
});
