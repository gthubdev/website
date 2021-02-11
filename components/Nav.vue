<template>
<div>
	<nav class="topnav">
		<div class="logo">
			<a href="/">
				<img class="logo" src="~/assets/img/GTHubNoBackground.svg" alt="GTHub's logo">
			</a>
		</div>

		<div class="p-grid p-align-center">
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
			<div class="p-col">
				<span class="nav-btn nav-btn-secondary">
					<nuxt-link to="/sessions">SESSIONS</nuxt-link>
				</span>
			</div>
			<div class="p-col">
				<span class="nav-btn nav-btn-secondary">
					<nuxt-link to="/about">ABOUT</nuxt-link>
				</span>
			</div>
		</div>
	</nav>
</div>
</template>

<script>
export default {
	name: 'Nav'
};
</script>

<style scoped>
a {
	color: #f7f7f7;
	text-decoration: none;
}
a:hover {
	color: #ed6400;
}
</style>
