<template>
<div class="w-full h-full flex justify-center items-center">
	<div class="bg-white p-8 shadow-xl rounded-md">
		<h2 class="text-xl text-center font-bold">
			GTHub
		</h2>
		<p class="text-center mb-3">
			Log in.
		</p>
		<form class="space-y-4" @submit.prevent="tryLogin">
			<div v-if="error" class="text-red-600 border border-red-600 py-2 rounded-md">
				<p class="text-center">
					<i class="pi pi-exclamation-circle pi-inline" /> {{ error }}
				</p>
			</div>
			<div>
				<label for="username" class="block">Username</label>
				<input
					id="username"
					v-model="credentials.username"
					type="text"
					name="username"
					class="border block w-full py-2 px-4 rounded-md"
					:class="invalidFields.username && 'border-red-600'"
				>
				<small v-if="invalidFields.username" class="text-red-600 text-capitalize">{{ invalidFields.username }}</small>
			</div>
			<div>
				<label for="password" class="block">Password</label>
				<div class="w-full relative border rounded-md overflow-hidden" :class="invalidFields.password && 'border-red-600'">
					<input
						id="password"
						v-model="credentials.password"
						:type="showPass ? 'text' : 'password'"
						name="password"
						class="py-2 px-4"
					>
					<button type="button" class="inline-block w-8" @click="showPass = !showPass">
						<i v-show="!showPass" class="pi pi-eye" /><i v-show="showPass" class="pi pi-eye-slash" />
					</button>
				</div>
				<small v-if="invalidFields.password" class="text-red-600 text-capitalize">{{ invalidFields.password }}</small>
			</div>
			<div>
				<button class="block w-full btn btn-primary py-3">
					<i v-show="loading" class="pi pi-spin pi-spinner" />
					<span v-show="!loading">Log in</span>
				</button>
			</div>
		</form>
	</div>
</div>
</template>

<script>
export default {
	layout: 'auth',
	data() {
		return {
			credentials: {
				username: '',
				password: ''
			},
			showPass: false,
			loading: false,
			error: null,
			invalidFields: {}
		};
	},
	methods: {
		async tryLogin() {
			this.loading = true;
			this.invalidFields = {};
			const requiredFields = [
				'username',
				'password'
			];

			let valid = true;

			for (const field of requiredFields)
				if (!this.credentials[field]) {
					valid = false;
					this.invalidFields[field] = `${field} is required.`;
				}

			if (!valid) {
				this.loading = false;
				return;
			}

			try {
				await this.$auth.loginWith('local', {
					data: this.credentials
				});
				this.$router.push('/admin');
			} catch (err) {
				this.error = 'Invalid credentials';
			} finally {
				this.loading = false;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
</style>
