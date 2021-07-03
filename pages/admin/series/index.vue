<template>
<div>
	<h2 class="text-2xl header-font">
		Series
	</h2>
	<pre>{{ series }}</pre>
	<DataView
		:value="displayedSeries"
		paginator-position="bottom"
		:paginator="true"
		:rows="10"
		:always-show-paginator="false"
	>
		<template #list="slotProps">
			<div class="resource-list-item-container">
				<div class="resource-list-item">
					{{ slotProps.data.name }}
				</div>
				<div>
					<Button icon="pi pi-pencil" @click="editSeries(slotProps.data)" />
					<Button icon="pi pi-trash" @click="sendDeleteRequest(slotProps.data)" />
				</div>
			</div>
		</template>
	</DataView>
</div>
</template>

<script>
import DataView from 'primevue/dataview';
import { mapGetters } from 'vuex';
export default {
	components: { DataView },
	layout: 'admin',
	data() {
		return {
			displayedSeries: []
		};
	},
	computed: {
		...mapGetters({
			series: 'resources/series/get'
		})
	},
	created() {
		this.displayedSeries = this.series;
	}
};
</script>

<style lang="scss" scoped>
@import "assets/scss/abstracts/variables";
.header-font {
	font-family: $header-font;
}
</style>
