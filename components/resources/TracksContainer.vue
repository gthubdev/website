<template>
<div>
	<div class="headline">
		<span class="md-display-1">Tracks</span>
	</div>
	<md-list>
		<md-list-item v-for="t in tracks" :key="t.id">
			<span class="md-list-item-text">{{ t.name }}</span>
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
		tracks: {
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
