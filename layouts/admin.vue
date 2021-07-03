<template>
<main class="flex h-screen bg-gray-100 text-gray-900">
	<nav class="w-2/12 bg-gth-blue-900 text-gray-200 h-full">
		<div class="flex justify-center items-baseline my-4 mx-2 border-b border-gray-500 pb-4">
			<img src="~/assets/img/logo.png" class="h-5 mr-2" alt="logo">
			<h2 class="text-2xl header-font font-bold m-0 p-0">
				GTHub
			</h2>
		</div>
		<ul class="mt-2 flex flex-col text-gray-400">
			<sidebar-item :id="1" :active="activeIndex == 1" @setActiveItem="activeIndex = 1">
				<template #title>
					<i class="pi pi-file mr-2" /> Blog
				</template>
				<template #content>
					<li>
						<nuxt-link to="/admin/posts" class="admin-sublink">
							Posts
						</nuxt-link>
					</li>
				</template>
			</sidebar-item>
			<sidebar-item :id="2" :active="activeIndex == 2" @setActiveItem="activeIndex = 2">
				<template #title>
					<i class="pi pi-calendar mr-2" /> Calendar
				</template>
				<template #content>
					<li>
						<nuxt-link to="/admin/events" class="admin-sublink">
							Events
						</nuxt-link>
					</li>
				</template>
			</sidebar-item>
			<sidebar-item :id="3" :active="activeIndex == 3" @setActiveItem="activeIndex = 3">
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
						<nuxt-link to="/admin/classes">
							Categories
						</nuxt-link>
					</li>
					<li class="admin-sublink">
						<nuxt-link to="/admin/classes">
							Tracks
						</nuxt-link>
					</li>
				</template>
			</sidebar-item>
		</ul>
	</nav>
	<div class="w-10/12 px-4">
		<nav class="w-full flex justify-end py-3 border-b">
			<nuxt-link :to="'/'" class="btn btn-link py-2 px-3">
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
import { mapMutations } from 'vuex';

export default {
	components: {
		Toast,
		SidebarItem
	},
	async asyncData({ $axios }) {
		try {
			const res = await $axios.$get('/api/resources');
			return {
				data: res
			};
		} catch (err) {
			return {
				data: []
			};
		}
	},
	data() {
		return {
			activeIndex: 0,
			data: []
		};
	},
	created() {
		this.setCategories(this.data.vehicleclasscategories);
		this.setClasses(this.data.vehicleclasses);
		this.setEvents(this.data.events);
		this.setSeries(this.data.series);
		this.setSessionTypes(this.data.sessiontypes);
		this.setTimezones(this.data.timezones);
		this.setTracks(this.data.tracks);
	},
	methods: {
		...mapMutations({
			setCategories: 'resources/classcategories/set',
			setClasses: 'resources/classes/set',
			setEvents: 'resources/events/set',
			setSeries: 'resources/series/set',
			setSessionTypes: 'resources/sessiontypes/set',
			setTimezones: 'usertz/setTimezones',
			setTracks: 'resources/tracks/set'
		})
	}
};
</script>

<style scoped lang="scss">
@import "assets/scss/abstracts/variables";

.admin-hover {
	&:hover {
		background: saturate(darken($blue, 35%), 5%) ;
	}

	.admin-sublink {
		@apply pl-12 pr-4 py-2 rounded-lg font-bold cursor-pointer hover:text-gray-100;
	}
}

.nuxt-link-exact-active {
	@apply text-gray-100;
}
</style>
