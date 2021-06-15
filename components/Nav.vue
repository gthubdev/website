<template>
<div>
	<nav class="topnav">
		<div class="logo-container">
			<a href="/">
				<img class="logo" src="~/assets/img/GTHubNoBackground.svg" alt="GTHub's logo">
			</a>
		</div>

		<div class="links-container">
			<div class="link-container">
				<span class="nav-btn nav-btn-secondary">
					<nuxt-link to="/">HOME</nuxt-link>
				</span>
			</div>

			<div class="link-container">
				<span class="nav-btn nav-btn-secondary">
					<nuxt-link to="/calendar">CALENDAR</nuxt-link>
				</span>
			</div>

			<div v-if="loggedIn" class="link-container">
				<span class="nav-btn nav-btn-secondary">
					<nuxt-link to="/resources">RESOURCES</nuxt-link>
				</span>
			</div>

			<div class="link-container">
				<span class="nav-btn nav-btn-secondary">
					<nuxt-link to="/about">ABOUT</nuxt-link>
				</span>
			</div>

			<div v-if="!loggedIn" class="link-container">
				<span class="nav-btn nav-btn-secondary" @click="toggleLoginOverlay">
					LOGIN
				</span>
			</div>

			<div v-if="loggedIn" class="link-container mr-2">
				<i
					class="pi pi-user white-icon"
					style="vertical-align: middle; font-size: 1.75em;"
					@click="toggleProfileOverlay"
				/>
			</div>

			<div v-if="loggedIn" class="link-container">
				<span class="nav-btn nav-btn-primary" @click="logout">LOGOUT</span>
			</div>

			<OverlayPanel id="overlay_panel" ref="login_op">
				<span class="p-float-label">
					<InputText id="username" v-model="username" type="text" />
					<label for="username">Username</label>
				</span>
				<br>
				<span class="p-float-label">
					<InputText id="password" v-model="password" type="password" />
					<label for="username">Password</label>
				</span>
				<span v-if="showLoginError" class="form-error">
					Wrong credentials.
					<br>
				</span>
				<br>
				<div class="align-right">
					<Button label="Login" class="p-button-raised" @click="login" />
				</div>
			</OverlayPanel>

			<OverlayPanel id="profile_overlay_panel" ref="profile_op">
				<b>{{ displayName() }}</b> ({{ displayUsername() }})
				<br>
				<hr>
				<b>Change password:</b>
				<br>
				<br>
				<span class="p-float-label">
					<InputText id="oldpassword" v-model="oldpassword" type="password" />
					<label for="oldpassword">Old password</label>
				</span>
				<br>
				<span class="p-float-label">
					<Password id="newpassword" v-model="newpassword" />
					<label for="newpassword">New password</label>
				</span>
				<br>
				<span class="p-float-label">
					<InputText id="newpassword_confirm" v-model="newpassword_confirm" type="password" />
					<label for="newpassword_confirm">Confirm new password</label>
				</span>
				<span v-if="showPasswordError" class="form-error">
					{{ passwordErrorText }}
					<br>
				</span>
				<br>
				<div class="align-right">
					<Button label="Submit" class="p-button-raised" @click="changePassword" />
				</div>
			</OverlayPanel>
		</div>
	</nav>
</div>
</template>

<script>
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import OverlayPanel from 'primevue/overlaypanel';
import Password from 'primevue/password';
import { mapState } from 'vuex';

export default {
	components: {
		Button, InputText, OverlayPanel, Password
	},
	data: function() {
		return {
			username: '',
			password: '',
			oldpassword: '',
			newpassword: '',
			newpassword_confirm: '',
			showLoginError: false,
			showPasswordError: false,
			passwordErrorText: ''
		};
	},
	computed: {
		...mapState('auth', ['loggedIn', 'user'])
	},
	methods: {
		async login() {
			try {
				await this.$auth.loginWith('local', {
					data: {
						username: this.username,
						password: this.password
					}
				});
				console.log('Successfully logged in as ' + this.user.username);
				this.toggleLoginOverlay();
			} catch (err) {
				console.log('Login was not successful.');
				this.showLoginError = true;
			}
		},
		async logout() {
			try {
				await this.$auth.logout();
				console.log('Successfully logged out.');
			} catch (err) {
				console.log('Logout was not successful.');
			}
		},
		async changePassword() {
			if (this.newpassword !== this.newpassword_confirm) {
				this.showPasswordError = true;
				this.passwordErrorText = 'Passwords do not match.';
				return;
			}

			try {
				await this.$axios.$post('/api/auth/changepassword', {
					username: this.user.username,
					oldpassword: this.oldpassword,
					newpassword: this.newpassword
				});
				this.toggleProfileOverlay();
				this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Password successfully changed.', life: 10000 });
			} catch (err) {
				console.log('Password-change unsuccessful.');
				this.showPasswordError = true;
				this.passwordErrorText = 'Wrong password.';
			}
		},
		toggleLoginOverlay(event) {
			this.username = '';
			this.password = '';
			this.showLoginError = false;
			this.$refs.login_op.toggle(event);
		},
		toggleProfileOverlay(event) {
			this.oldpassword = '';
			this.newpassword = '';
			this.newpassword_confirm = '';
			this.showPasswordError = false;
			this.$refs.profile_op.toggle(event);
		},
		displayName() {
			return this.loggedIn ? this.user.name : '';
		},
		displayUsername() {
			return this.loggedIn ? this.user.username : '';
		}
	}
};
</script>

<style lang="scss" scoped>
@import "assets/scss/abstracts/variables";

.topnav {
	@apply w-full justify-center m-auto flex h-20 my-1 px-12;
	border-bottom: 4px solid;
	border-image: $nav-gradient 1;
}
.logo-container {
	@apply flex-grow-0 object-contain flex mb-1;
}
.logo {
	@apply h-16;
}
.links-container {
	@apply flex flex-grow justify-end items-center;
}
.link-container {

}
a {
	color: #f7f7f7;
	text-decoration: none;
}
a:hover {
	color: #ed6400;
}
</style>
