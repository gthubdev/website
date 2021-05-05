<template>
<div class="resources">
	<div class="flex justify-between my-4">
		<div>
			<span class="p-input-icon-left">
				<i class="pi pi-search" />
				<InputText id="trackSearchTerm" v-model="searchTerm" type="text" />
			</span>
		</div>
		<div>
			<Button label="CREATE EVENT" class="p-button-raised" @click="openEventCrud()" />
		</div>
	</div>
	<div>
		<DataView
			:value="displayedEvents"
			paginator-position="bottom"
			:paginator="true"
			:rows="5"
			:always-show-paginator="false"
		>
			<template #list="slotProps">
				<div class="w-screen flex justify-between py-2 items-center">
					<div class="resource-list-item">
						{{ slotProps.data.name }}
					</div>
				</div>
			</template>
		</DataView>
	</div>
</div>
</template>

<script>
import DataView from 'primevue/dataview';
import InputText from 'primevue/inputtext';
import { mapGetters } from 'vuex';

export default {
	components: {
		DataView, InputText
	},
	data: function() {
		return {
			searchTerm: '',
			displayedEvents: []
		};
	},
	computed: {
		...mapGetters({
			events: 'resources/events/get'
		})
	},
	watch: {
		searchTerm(newvalue) {
			if (newvalue.trim() === '')
				this.displayedEvents = [...this.events];
			else
				this.displayedEvents = this.events.filter(t => {
					return t.name.toLowerCase().includes(newvalue.toLowerCase());
				});
		}
	},
	created() {
		this.displayedEvents = this.events;
	},
	methods: {
		openEventCrud() {
			;
		}
	}
};
</script>

<style scoped>

</style>
