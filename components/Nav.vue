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
				<span class="nav-btn nav-btn-primary" @click="login">LOGIN</span>
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
		</div>
	</nav>
</div>
</template>


<script>
import { mapState } from 'vuex';

export default {
	name: 'Navigation',
	computed: {
		...mapState('auth', ['loggedIn', 'user'])
	},
	methods: {
		async login() {
			try {
				await this.$auth.loginWith('local', {
					data: {
						username: 'admin',
						password: 'admin'
					}
				});
				console.log('Successfully logged in as ' + this.user.username);
			} catch(err) {
				console.log('Login was not successful.');
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
