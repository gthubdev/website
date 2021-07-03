<template>
<transition
	@enter="onEnter"
	@after-enter="onAfterEnter"
	@before-leave="onBeforeLeave"
	@leave="onLeave"
>
	<div v-if="expanded" ref="wrapper" class="accordion" :style="wrapperStyle">
		<div ref="inner" class="accordion-inner">
			<slot />
		</div>
	</div>
</transition>
</template>

<script>
export default {
	props: {
		expanded: {
			type: Boolean,
			default: false
		},
		duration: {
			type: Number,
			default: 250
		}
	},
	computed: {
		wrapperStyle() {
			return {
				transitionDuration: `${this.duration}ms`
			};
		}
	},
	mounted() {
		if (this.expanded)
			this.setWrapperHeightTo('auto');
	},
	methods: {
		onEnter(el) {
			this.setWrapperHeightTo(this.getContentHeight(), el);
		},

		onAfterEnter(el) {
			this.setWrapperHeightTo('auto', el);
		},

		onBeforeLeave(el) {
			this.setWrapperHeightTo(this.getContentHeight(), el);
		},

		onLeave(el) {
			// el.scrollHeight;
			this.setWrapperHeightTo(0, el);
		},

		getContentHeight() {
			const inner = this.$refs.inner;
			return inner.getBoundingClientRect().height;
		},

		/**
		 * @param {number | 'auto'} height
		 */
		setWrapperHeightTo(height, el = this.$refs.inner) {
			el.style.height = typeof height === 'number' ? `${height}px` : height;
		}
	}
};
</script>

<style lang="scss" scoped>
.accordion {
	transition-timing-function: ease;
	transition-property: height;
	height: 0;
	overflow: hidden;

	&-inner {
		display: table;
		width: 100%;
	}
}
</style>
