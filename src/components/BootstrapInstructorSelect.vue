<script lang="ts">
import { defineComponent } from "vue";
import VideoLibraryDataService from "@/services/VideoLibraryDataService";

export default defineComponent({
	props: {
		value: String,
		text: { type: String, required: true },
		help: { type: String, required: false },
	},
	emits: ["update:value"],
	computed: {
		id() {
			return this.text.toLowerCase().replace(/\s/g, "-").replace(/[^a-z0-9-]/g, "");
		},
	},
	methods: {
		fetchData() {
			this.loading = true;
			// Load videos
			VideoLibraryDataService.getInstructors().then((res) => {
				this.instructors = res.data;
				this.instructor_keys = Object.keys(res.data).sort((a, b) => {
					return res.data[a].name.localeCompare(res.data[b].name);
				});
				this.loading = false;
			});
		},
		shareUpdates(event) {
			let selected = [...event.target.options].filter(option => option.selected).map(option => option.value)
			this.$emit('update:value', selected)
		}
	},
	data() {
		return {
			loading: false,
			instructors: [],
			instructor_keys: [],
		}
	},
	mounted() {
		this.fetchData();
	},
});
</script>

<template>
	<div>
		<label :for="'input-' + id" class="col-form-label">{{ text }}</label>
		<select
			:id="'input-' + id"
			class="form-select"
			multiple
			:aria-describedby="'input-help-' + id"
			style="height: 300px"
			@change="shareUpdates($event)"
		>
			<option v-for="key in instructor_keys" :value="key" :key="key">{{ instructors[key].name }} (@{{ key }})</option>
		</select>

		<span :id="'input-help-' + id" class="form-text">{{ help }}</span>
	</div>
</template>
