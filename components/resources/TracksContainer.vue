<template>
<div class="md-layout">
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
.md-list-item-text {
	margin-right: 2em !important;
}
</style>
