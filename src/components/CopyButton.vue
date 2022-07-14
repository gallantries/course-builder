<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	props: {
		data: String,
	},
	data() {
		return {
			canCopy: !!navigator.clipboard,
		};
	},
	methods: {
		copy(s: string) {
			navigator.clipboard.writeText(s);
			alert("Copied!");
		},
	},
});
</script>

<template>
	<button v-if="canCopy" @click="copy(data || '')">Copy</button>
</template>

<style scoped></style>
