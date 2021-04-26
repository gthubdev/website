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
			<div class="link-container">
				<span class="nav-btn nav-btn-secondary">
					<nuxt-link to="/resources">RESOURCES</nuxt-link>
				</span>
			</div>
			<div class="link-container">
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
