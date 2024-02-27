import vine from '@vinejs/vine';

export const schema = vine.object({
	email: vine.string().trim().email(),
	password: vine.string().minLength(8).confirmed()
});

// For confirmed password
export interface typeReturnData {
	email: string;
	password: string;
	password_confirmation: string;
}
