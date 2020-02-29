
<template>
<div>
	<nav class="topnav">
		<a href="/" class="logoref">
			<img class="logo" src="~/assets/img/GTHubNoBackground.svg" alt="GTHub's logo" />
		</a>
		<div class="buttonContainer">
			<Button v-if="loggedIn" :label="displayUsername()" class="p-button-raised p-button-rounded p-button-secondary" />
			<Button label="Home" class="p-button-raised p-button-rounded p-button-secondary" onclick="window.location.href = '/home';" />
			<Button label="Calendar" class="p-button-raised p-button-rounded p-button-secondary" onclick="window.location.href = '/calendar';" />
			<Button label="Gallery" class="p-button-raised p-button-rounded p-button-secondary" @click="testClick()" />
			<Button label="About" class="p-button-raised p-button-rounded p-button-secondary" @click="testClick()" />
			<Button v-if="loggedIn" label="Resources" class="p-button-raised p-button-rounded p-button-secondary" onclick="window.location.href = '/resources';" />
			<Button v-if="!loggedIn" label="LOGIN" class="p-button-raised p-button-rounded" @click="login()" />
			<Button v-if="loggedIn" label="LOGOUT" class="p-button-raised p-button-rounded" @click="logout()" />

			<md-button class="icon md-primary" @click="responsive()">
				<md-icon style="color:white;">
					menu
				</md-icon>
			</md-button>
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
