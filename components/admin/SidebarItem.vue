<template>
<div class="admin-hover py-4 " :class="expanded && 'admin-active'">
	<h4 class="text-lg px-3 cursor-pointer" @click="toggleAccordion">
		<slot name="title" />
	</h4>
	<accordion class="my-2" :expanded="expanded">
		<slot name="content" />
	</accordion>
</div>
</template>

<script>
import Accordion from '../simple/Accordion.vue';
export default {
	components: { Accordion },
	props: {
		id: {
			type: Number,
			default: -1
		},
		active: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			expanded: this.active
		};
	},
	watch: {
		active() {
			this.expanded = this.active;
		}
	},
	methods: {
		toggleAccordion() {
			this.expanded = !this.expanded;
			this.$emit('setActiveItem', this.id);
		}
	}
};
</script>

<style lang="scss" scoped>
@import "assets/scss/abstracts/variables";

.admin-hover {
	&:hover {
		background: saturate(darken($blue, 35%), 5%) ;
	}

	.admin-sublink {
		@apply pl-12 pr-4 py-2 rounded-lg font-bold cursor-pointer hover:text-gray-100;
	}
}

.admin-active {
	background: saturate(darken($blue, 35%), 5%);

	h4 {
		@apply text-gray-100;
	}
}

.nuxt-link-active {
	@apply text-gray-100;
}
</style>
