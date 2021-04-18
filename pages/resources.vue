<template>
<div>
	<h1 class="page-headline">
		Resources
	</h1>
	<TabView>
		<TabPanel header="Events">
			Events...
		</TabPanel>
		<TabPanel header="Series">
			Series...
		</TabPanel>
		<TabPanel header="Tracks">
			Tracks...
		</TabPanel>
	</TabView>
</div>
</template>

<script>
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

export default {
	components: {
		TabPanel, TabView
	},
	async asyncData({ $axios }) {
		try {
			const res = await $axios.$get('/api/calendar');
			return {
				data: res
			};
		} catch (err) {
			return {
				data: []
			};
		}
	},
	data: function() {
		return {
			data: []
		};
	}
};
</script>

<style scoped>

</style>
