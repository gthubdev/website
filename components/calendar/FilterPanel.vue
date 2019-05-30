<template>
<div class="md-layout-item md-size-20 filter">
	<div>FILTER-BOX</div>
	<md-button class="md-raised md-primary" @click.native='toggleCurrentEvents()'>{{ showCurrentEventsLabel }}</md-button>
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
		toggleCurrentEvents: function() {
			this.$emit('toggleCurrentEvents');
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
