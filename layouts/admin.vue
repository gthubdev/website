<template>
<main class="flex h-screen bg-gray-100 text-gray-900">
	<nav class="w-2/12 bg-gth-blue-900 text-gray-200 h-full">
		<div class="flex justify-center items-baseline my-4 mx-6 border-b border-gray-500 pb-4">
			<img src="~/assets/img/logo.png" class="h-5 mr-2" alt="logo">
			<h2 class="text-2xl header-font font-bold m-0 p-0">
				GTHub
			</h2>
		</div>
		<ul class="mt-2 flex flex-col text-gray-400">
			<sidebar-item :id="1" ref="sidebar-1" :data-id="1" :active="activeIndex == 1" @setActiveItem="activeIndex = 1">
				<template #title>
					<i class="pi pi-file mr-2" /> Blog
				</template>
				<template #content>
					<li class="admin-sublink">
						<nuxt-link to="/admin/posts" class="admin-sublink">
							Posts
						</nuxt-link>
					</li>
				</template>
			</sidebar-item>
			<sidebar-item :id="2" ref="sidebar-2" :data-id="2" :active="activeIndex == 2" @setActiveItem="activeIndex = 2">
				<template #title>
					<i class="pi pi-calendar mr-2" /> Calendar
				</template>
				<template #content>
					<li class="admin-sublink">
						<nuxt-link to="/admin/events" class="admin-sublink">
							Events
						</nuxt-link>
					</li>
				</template>
			</sidebar-item>
			<sidebar-item :id="3" ref="sidebar-3" :data-id="3" :active="activeIndex == 3" @setActiveItem="activeIndex = 3">
				<template #title>
					<i class="pi pi-flag mr-2" /> Resources
				</template>
				<template #content>
					<li class="admin-sublink">
						<nuxt-link to="/admin/series">
							Series
						</nuxt-link>
					</li>
					<li class="admin-sublink">
						<nuxt-link to="/admin/classes">
							Classes
						</nuxt-link>
					</li>
					<li class="admin-sublink">
						<nuxt-link to="/admin/categories">
							Categories
						</nuxt-link>
					</li>
					<li class="admin-sublink">
						<nuxt-link to="/admin/tracks">
							Tracks
						</nuxt-link>
					</li>
				</template>
			</sidebar-item>
		</ul>
	</nav>
	<div class="w-10/12 px-10 h-screen overflow-y-auto">
		<nav class="w-full top-0 bg-gray-100 flex justify-between items-baseline py-3 border-b">
			<h2 class="text-2xl text-capitalize">
				{{ $route.name.split('-')[1] }}
			</h2>
			<nuxt-link :to="'/'" class="btn btn-link py-2 px-3 hover:text-gth-blue">
				<i class="pi pi-arrow-circle-right" /> Back to site
			</nuxt-link>
		</nav>
		<Nuxt />
	</div>
	<Toast />
</main>
</template>

<script>
import Toast from 'primevue/toast';
import SidebarItem from '@/components/admin/SidebarItem';

export default {
	components: {
		Toast,
		SidebarItem
	},
	middleware: 'auth',
	data() {
		return {
			activeIndex: 0
		};
	}
};
</script>

<style scoped lang="scss">
@import "assets/scss/abstracts/variables";

.admin-hover {
	&:hover {
		background: saturate(darken($blue, 35%), 5%) ;
	}

	.admin-sublink
		a {
			@apply block text-sm pl-14 w-full pr-4 py-2 rounded-lg font-bold cursor-pointer hover:text-gray-100;
		}
	}

.nuxt-link-exact-active {
	@apply text-gray-100;
}
</style>
