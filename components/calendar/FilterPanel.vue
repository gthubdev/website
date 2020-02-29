<template>
<div class="filter">
	<div style="margin-bottom: 1em">
		FILTER-BOX
	</div>
	<Button
		:label="showCurrentEventsLabel"
		class="p-button-raised p-button-info"
		@click="toggleCurrentEvents()"
	/>
</div>
</template>

<script>
import { strings } from '~/plugins/constants';

export default {
	props: {
		showCurrentEvents: {
			type: Boolean, default: true
		}
	},
	computed: {
		showCurrentEventsLabel: function() {
			return this.showCurrentEvents ? 'Show all' : 'Show current';
		}
	},
	methods: {
		toggleCurrentEvents: function() {
			this.$root.$emit(strings.TOGGLE_CURRENT_EVENTS);
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
