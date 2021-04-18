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
			<ResourcesSeriesContainer />
		</TabPanel>
		<TabPanel header="Tracks">
			<ResourcesTrackContainer />
		</TabPanel>
	</TabView>
</div>
</template>

<script>
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import ResourcesSeriesContainer from '@/components/resources/ResourcesSeriesContainer';
import ResourcesTrackContainer from '@/components/resources/ResourcesTrackContainer';
import { mapMutations } from 'vuex';

export default {
	components: {
		ResourcesSeriesContainer, ResourcesTrackContainer, TabPanel, TabView
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
	},
	created() {
		this.setSeries(this.data.series);
		this.setTracks(this.data.tracks);
	},
	methods: {
		...mapMutations({
			setSeries: 'resources/series/set',
			setTracks: 'resources/tracks/set'
		})
	}
};
</script>

<style scoped>

</style>
