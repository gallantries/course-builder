<script lang="ts">
import { defineComponent } from "vue";
import {
	getCourseItemKey,
	type CourseEvent,
	type CourseItemOptions,
} from "../interface.js";
import { dump } from "js-yaml";
import { transformModel } from "@vue/compiler-core";
import CopyButton from "./CopyButton.vue";

export default defineComponent({
	props: {
		event: { type: Object, required: true },
	},
	computed: {
		yamlEvent() {
			const clone = JSON.parse(JSON.stringify(this.event));
			Object.keys(clone.program).forEach((key) => {
				clone.program[key].trainings = clone.program[
					key
				].trainings.map((x: CourseItemOptions) => {
					if (getCourseItemKey(x) === null) {
						return x;
					}
					return getCourseItemKey(x);
				});
				delete clone.program[key].id;
			});
			console.log(clone);
			delete clone["content"];
			return dump(clone);
		},
		markdownText() {
			if (this.event.content !== undefined) {
				return (
					this.event.content.replace(
						/\\n/,
						"\n"
					) || "Write some content here!"
				);
			}
			return "Write some content here!";
		},
		fullText() {
			return (
				"---\n" +
				this.yamlEvent +
				"\n---\n" +
				this.markdownText
			);
		},
	},
	components: { CopyButton },
});
</script>

<template>
	<CopyButton :data="fullText"></CopyButton>
	<pre>
---
{{ yamlEvent }}
---

{{ markdownText }}
        </pre>
</template>

<style scoped></style>
