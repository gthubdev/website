<template>
<div class="md-layout-item md-size-20 filter">
	<div>CONTROL-BOX</div>
	<br />
	<md-button class="md-raised md-primary" @click.native="showSeries()">
		Show Series
	</md-button>
	<br />
	<md-button class="md-raised md-primary" @click.native="showTracks()">
		Show Tracks
	</md-button>
</div>
</template>

<script>

export default {
	methods: {
		showSeries: function() {
			this.$root.$emit('showResourcesSeries');
		},
		showTracks: function() {
			this.$root.$emit('showResourcesTracks');
		}
	}
};
</script>

<style lang="scss" scoped>
.filter {
	font-family: Roboto, sans-serif;
	font-size: 24px;
	margin: 1em;
	padding: 1em;
	border: 2px solid blue;
}
</style>
