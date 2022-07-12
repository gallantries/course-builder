<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	props: {
		event: { type: Object, required: true },
	},
});
</script>

<template>
	<div class="row g-3 align-items-center">
		<div class="col-md-2 text-end">
			<label for="i-title" class="col-form-label">Title</label>
		</div>
		<div class="col-md-3">
			<input
				type="text"
				id="i-title"
				class="form-control"
				aria-describedby="i-title-help"
				:value="event.title"
				onchange="rerenderSchedule()"
			/>
		</div>
		<div class="col-md-6">
			<span id="i-title-help" class="form-text"> </span>
		</div>
	</div>
	<div class="row g-3 align-items-center">
		<div class="col-md-2 text-end">
			<label for="i-description" class="col-form-label">Description</label>
		</div>
		<div class="col-md-3">
			<input
				type="text"
				id="i-description"
				class="form-control"
				aria-describedby="i-description-help"
				value="Best training since bread slicing lessons"
				onchange="rerenderSchedule()"
			/>
		</div>
		<div class="col-md-6">
			<span id="i-description-help" class="form-text"> </span>
		</div>
	</div>
	<div class="row g-3 align-items-center">
		<div class="col-md-2 text-end">
			<label for="i-instructors" class="col-form-label">Event Instructors</label>
		</div>
		<div class="col-md-3">
			<select
				id="i-instructors"
				class="form-select"
				multiple
				aria-label="Instructor select box"
				style="height: 300px"
				onchange="rerenderSchedule()"
			>
				<option value="bob">Bob bob</option>
			</select>
		</div>
		<div class="col-md-6">
			<span id="i-instructors-help" class="form-text"> Who all is involved in teaching this event? </span>
		</div>
	</div>
</template>

<style scoped></style>
