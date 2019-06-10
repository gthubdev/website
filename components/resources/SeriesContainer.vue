<template>
<div class="md-layout">
	<md-list>
		<md-list-item v-for="s in series" :key="s.id">
			<span class="md-list-item-text">{{ s.name }}</span>
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
		series: {
			type: Array,
			default() { return []; }
		}
	}
};
</script>

<style lang="scss" scoped>
.md-list-item-text {
	margin-right: 2em !important;
}
</style>
