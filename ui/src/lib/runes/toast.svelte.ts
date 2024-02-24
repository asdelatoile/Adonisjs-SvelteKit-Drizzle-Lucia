import { v4 as uuidv4 } from 'uuid';
import { getContext, hasContext, setContext } from 'svelte';

type Toast = {
	id?: string;
	message?: string;
	type: 'info' | 'success' | 'error' | 'warning' | null;
	duration?: number | null;
};

type Toasts = {
	records: Toast[];
	addToast: (eltToast: Toast) => void;
};

export const createToast = (context = 'default'): Toasts => {
	if (hasContext(context)) {
		return getContext(context);
	}
	let toasts = $state<Toast[]>([]);
	const closeToast = (id: string) => {
		console.log(id);
		toasts = toasts.filter((elt) => elt.id !== id);
	};
	const addToast = ({ message, duration = 2500, type = 'info' }: Toast) => {
		const newId = uuidv4();
		console.log('new', {
			type,
			message,
			id: newId
		});
		toasts = [
			...toasts,
			{
				type,
				message,
				id: newId
			}
		];
		if (duration) {
			setTimeout(() => {
				closeToast(newId);
			}, duration);
		}
	};
	const _rune = {
		get records() {
			return toasts;
		},
		addToast: addToast
	};
	setContext(context, _rune);
	return _rune;
};
