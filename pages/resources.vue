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
		<TabPanel header="Class Categories">
			<ResourcesClassCategoryContainer />
		</TabPanel>
		<TabPanel header="Classes">
			<ResourcesClassContainer />
		</TabPanel>
	</TabView>
</div>
</template>

<script>
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import { mapMutations } from 'vuex';
import ResourcesClassCategoryContainer from '~/components/resources/ResourcesClassCategoryContainer';
import ResourcesClassContainer from '~/components/resources/ResourcesClassContainer';
import ResourcesEventContainer from '~/components/resources/ResourcesEventContainer';
import ResourcesSeriesContainer from '~/components/resources/ResourcesSeriesContainer';
import ResourcesTrackContainer from '~/components/resources/ResourcesTrackContainer';

export default {
	components: {
		ResourcesClassCategoryContainer,
		ResourcesClassContainer,
		ResourcesEventContainer,
		ResourcesSeriesContainer,
		ResourcesTrackContainer,
		TabPanel,
		TabView
	},
	middleware: 'auth',
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

<style scoped>

</style>
