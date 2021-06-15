export default function({ store, error }) {
	if (!store.state.auth.user)
		error({
			message: 'You are not connected',
			statusCode: 403
		});
}
