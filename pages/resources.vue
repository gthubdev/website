<template>
<div>
	<h1 class="page-headline">
		Resources
	</h1>
	<TabView>
		<TabPanel header="Events">
			<ResourcesEventContainer />
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
import ResourcesEventContainer from '@/components/resources/ResourcesEventContainer';
import ResourcesSeriesContainer from '@/components/resources/ResourcesSeriesContainer';
import ResourcesTrackContainer from '@/components/resources/ResourcesTrackContainer';
import { mapMutations } from 'vuex';

export default {
	components: {
		ResourcesEventContainer, ResourcesSeriesContainer, ResourcesTrackContainer, TabPanel, TabView
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
	data: function() {
		return {
			data: []
		};
	},
	created() {
		this.setEvents(this.data.events);
		this.setSeries(this.data.series);
		this.setTracks(this.data.tracks);
	},
	methods: {
		...mapMutations({
			setEvents: 'resources/events/set',
			setSeries: 'resources/series/set',
			setTracks: 'resources/tracks/set'
		})
	}
};
</script>

<style scoped>

</style>
