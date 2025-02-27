import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	// redirect to demo article page
	if (url.pathname === '/') {
		throw redirect(307, '/articles/werbeeinnahmen-im-digitalen-zeitalter');
	}
};
