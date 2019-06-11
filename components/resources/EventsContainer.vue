<template>
<div>
	<div class="headline">
		<span class="md-display-1">Events</span>
	</div>
	<md-list v-if="events.length > 0">
		<md-list-item v-for="e in events" :key="e.id">
			<span class="md-list-item-text">
				<strong>{{ e.startdate }} - {{ e.enddate }}</strong>
				{{ e.name }}
			</span>
			<md-icon>
				edit
			</md-icon>
			<md-icon @click.native="deleteEvent(e.id)">
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
	},
	methods: {
		async deleteEvent(id) {
			const res = await this.$axios.$post('/api/calendar/event/delete/' + id);
			if (res.deleted >= 1)
				this.$root.$emit('eventDeleted', id);
		}
	}
};
</script>

<style lang="scss" scoped>
.headline {
	margin-bottom: 1em;
}
</style>
