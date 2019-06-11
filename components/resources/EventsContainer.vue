<template>
<div>
	<div class="headline">
		<span class="md-display-1">Events</span>
	</div>
	<md-list>
		<md-list-item v-for="e in events" :key="e.id">
			<span class="md-list-item-text">
				<strong>{{ e.startdate }} - {{ e.enddate }}</strong>
				{{ e.name }}
			</span>
			<md-icon>
				edit
			</md-icon>
			<md-icon>
				delete
			</md-icon>
		</md-list-item>
	</md-list>
</div>
</template>

<script>
export default {
	props: {
		events: {
			type: Array,
			default() { return []; }
		}
	}
};
</script>

<style lang="scss" scoped>
.headline {
	margin-bottom: 1em;
}
</style>
