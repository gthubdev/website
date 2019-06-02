<template>
<div class="md-layout-item md-size-20 filter">
	<div>FILTER-BOX</div>
	<md-button class="md-raised md-primary" @click.native="toggleCurrentEvents()">
		{{ showCurrentEventsLabel }}
	</md-button>
	<br />
	<md-button class="md-raised md-primary" @click.native="createSeries()">
		Create Series
	</md-button>
	<br />
	<md-button class="md-raised md-primary" @click.native="createTrack()">
		Create Track
	</md-button>
	<br />
	<md-button class="md-raised md-primary" @click.native="createEvent()">
		Create Event
	</md-button>
</div>
</template>

<script>

export default {
	props: {
		showCurrentEvents: {
			type: Boolean,
			default: true
		}
	},
	computed: {
		showCurrentEventsLabel: function() {
			return this.showCurrentEvents ? 'Show all' : 'Show current';
		}
	},
	methods: {
		createEvent: function() {
			this.$root.$emit('toggleCrudEvent');
		},
		createSeries: function() {
			this.$root.$emit('toggleCrudSeries');
		},
		createTrack: function() {
			this.$root.$emit('toggleCrudTrack');
		},
		toggleCurrentEvents: function() {
			this.$root.$emit('toggleCurrentEvents');
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
