<template>
<div>
	<nav class="topnav">
		<a href="/" class="logoref">
			<img class="logo" src="~/assets/img/GTHubNoBackground.svg" alt="GTHub's logo" />
		</a>
		<div class="p-grid buttonContainer">
			<div class="p-col">
				<span class="nav-btn nav-btn-secondary">
					<nuxt-link to="/">HOME</nuxt-link>
				</span>
			</div>
			<div class="p-col">
				<span class="nav-btn nav-btn-secondary">
					<nuxt-link to="/calendar">CALENDAR</nuxt-link>
				</span>
			</div>
			<!--<div class="p-col">
				<span class="nav-btn nav-btn-secondary">
					<nuxt-link to="/about">ABOUT</nuxt-link>
				</span>
			</div>-->
			<div v-if="loggedIn" class="p-col">
				<span class="nav-btn nav-btn-secondary">
					<nuxt-link to="/resources">RESOURCES</nuxt-link>
				</span>
			</div>
			<div v-if="!loggedIn" class="p-col">
				<span class="nav-btn nav-btn-primary" @click="toggleLoginMask">LOGIN</span>
			</div>
			<div v-if="loggedIn" class="p-col">
				<span class="nav-btn nav-btn-primary" @click="logout">LOGOUT</span>
			</div>
			<!--
			<md-button class="icon md-primary" @click="responsive()">
				<md-icon style="color:white;">
					menu
				</md-icon>
			</md-button>-->
			<OverlayPanel id="overlay_panel" ref="login_op">
				<span class="p-float-label">
					<InputText id="username" v-model="username" type="text" />
					<label for="username">Username</label>
				</span>
				<br />
				<span class="p-float-label">
					<InputText id="password" v-model="password" type="password" />
					<label for="username">Password</label>
				</span>
				<span v-if="showLoginError" class="login-error">
					Wrong credentials.
					<br />
				</span>
				<br />
				<div class="align-right">
					<Button label="Login" class="p-button-raised" @click="login" />
				</div>
			</OverlayPanel>
		</div>
	</nav>
</div>
</template>


<script>
import { mapState } from 'vuex';

export default {
	name: 'Navigation',
	data: function() {
		return {
			username: '',
			password: '',
			showLoginError: false
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
				this.toggleLoginMask();
			} catch(err) {
				console.log('Login was not successful.');
				this.showLoginError = true;
			}
		},
		async logout() {
			try {
				await this.$auth.logout();
				// console.log('Successfully logged out.');
			} catch(err) {
				console.log('Logout was not successful.');
			}
		},
		toggleLoginMask(event) {
			this.username = '';
			this.password = '';
			this.showLoginError = false;
			this.$refs.login_op.toggle(event);
		},
		testClick() {
			alert('Don\'t click that button, idiot!');
		},
		displayUsername() {
			return this.loggedIn ? 'Logged in as ' + this.user.username : '';
		},
		responsive() {
			let x = document.getElementsByTagName('nav')[0];
			if (x.className === 'topnav') {
				x.className += ' responsive';
			}
		}
	}
};
</script>
<style lang="scss">
.p-overlaypanel-content {
	padding-top: 1.5em !important;
}
.login-error {
	color: red;
	margin: 1em 0 1em 0;
}
</style>