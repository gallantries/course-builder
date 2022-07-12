<script lang="ts">
import { defineComponent } from "vue";
import type { CourseEvent } from "../interface.js";
import { dump } from "js-yaml";

export default defineComponent({
	props: {
		event: { type: Object, required: true },
	},
	computed: {
		yamlEvent() {
			let clone = JSON.parse(JSON.stringify(this.event));
			Object.keys(clone.program).forEach(key => {
				clone.program[key].trainings = clone.program[key].trainings.map(x => x.id)
				delete clone.program[key].id
			});
			return dump(clone);
		},
	},
});
</script>

<template>
	<pre>
---
{{ yamlEvent }}
---

Your event data goes here
        </pre>
</template>

<style scoped></style>
