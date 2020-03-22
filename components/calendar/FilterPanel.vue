<template>
<div class="p-grid">
	<div class="p-col-12 filter">
		<div class="filter-headline">
			Filter
		</div>
		<div class="headline-sep-line" />
	</div>

<!--	<Button
		:label="showCurrentEventsLabel"
		class="p-button-raised p-button-info"
		@click="toggleCurrentEvents()"
	/>-->
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
	padding: 0 2em 0 2em;
}
.filter-headline {
	padding: 1em 0 .25em 0;
	font-size: 2em;
	font-variant: small-caps;
	font-weight: bold;
	color: #F7F7F7;
}
</style>
