<template>
<div class="md-layout">
	<SidePanel />
	<div class="md-layout-item flex-start">
		<div class="headline">
			<span class="md-display-1">{{ headline }}</span>
		</div>
		<SeriesContainer v-if="activeModel === 'series'"
			:series="data.series"
		/>
		<TracksContainer v-else-if="activeModel === 'tracks'"
			:tracks="data.tracks"
		/>
	</div>
</div>
</template>

<script>
import SidePanel from '~/components/resources/SidePanel.vue';
import SeriesContainer from '~/components/resources/SeriesContainer.vue';
import TracksContainer from '~/components/resources/TracksContainer.vue';

export default {
	components: {
		SidePanel, SeriesContainer, TracksContainer
	},
	data: function() {
		return {
			data: [],
			activeModel: ''
		};
	},
	computed: {
		headline: function() {
			switch(this.activeModel) {
				case 'series':
					return 'Series';
				case 'tracks':
					return 'Tracks';
				default:
					return ' ';
			}
		}
	},
	async asyncData({
		$axios
	}) {
		const resdata = await $axios.$get('/api/calendar');
		return {
			data: resdata
		};
	},
	mounted() {
		this.$root.$on('showResourcesSeries', () => {
			this.activeModel = 'series';
		});
		this.$root.$on('showResourcesTracks', () => {
			this.activeModel = 'tracks';
		});
	}
};
</script>
