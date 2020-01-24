
<template>
<div>
	<nav class="topnav">
		<a href="/" class="logoref">
			<img class="logo" src="~/assets/img/GTHubNoBackground.svg" alt="GTHub's logo" />
		</a>
		<div class="buttonContainer">
			<md-button v-if="loggedIn" class="md-primary">
				Logged in as {{ user.username }}
			</md-button>
			<md-button class="md-primary" href="/">
				Home
			</md-button>
			<md-button class="md-primary" href="/calendar">
				Calendar
			</md-button>
			<Button label="Gallery" class="p-button-raised p-button-rounded" @click="testClick()" />
			<Button label="About" class="p-button-raised p-button-rounded p-button-success" icon="pi pi-check" icon-pos="right" @click="testClick()" />
			<Button label="Danger" class="p-button-raised p-button-rounded p-button-danger" icon="pi pi-times-circle" icon-pos="left" @click="testClick()" />
			<md-button v-if="loggedIn" class="md-primary" href="/resources">
				Resources
			</md-button>
			<md-button v-if="!loggedIn" class="md-raised md-primary btn-primary" @click="login()">
				Log In
			</md-button>
			<md-button v-if="loggedIn" class="md-raised md-primary btn-primary" @click="logout()">
				Log Out
			</md-button>
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
		testClick: function() {
			alert('Don\'t click that button, idiot!');
		},
		responsive: function() {
			var x = document.getElementsByTagName('nav')[0];
			if (x.className === 'topnav') {
				x.className += ' responsive';
			} else {
				x.className = 'topnav';
			}
		}
	}
};
</script>
