<script lang="ts">
import ModuleList from "./components/ModuleList.vue";
import TabButton from "./components/TabButton.vue";
import Tab from "./components/Tab.vue";
import ScheduleSettings from "./components/ScheduleSettings.vue";
import VisualiseMarkdown from "./components/VisualiseMarkdown.vue";
import type { CourseEvent, CourseSection, CourseSections } from "./interface.js";
import draggable from "vuedraggable";
import BootstrapInput from "./components/BootstrapInput.vue";
import BootstrapInstructorSelect from "./components/BootstrapInstructorSelect.vue";
import BootstrapInstitutionSelect from "./components/BootstrapInstitutionSelect.vue";
import BootstrapTime from "./components/BootstrapTime.vue";
import BootstrapDate from "./components/BootstrapDate.vue";
import { defineComponent } from "vue";

interface Tmp {
	id: string;
	title: string;
}

export default defineComponent({
	components: {
		ModuleList,
		TabButton,
		Tab,
		ScheduleSettings,
		VisualiseMarkdown,
		draggable,
		BootstrapInput,
		BootstrapInstructorSelect,
		BootstrapInstitutionSelect,
		BootstrapTime,
		BootstrapDate,
	},
	data() {
		let today = new Date();
		const event: CourseEvent = {
			layout: "event",
			title: "My Awesome Event",
			location: "Online",
			cost: "free",
			audience: "Open for all, but target audience is clinicians and researchers",
			description: "Best training since bread slicing lessons",
			format: "Asynchronous; all training sessions are pre-recorded and provided in advance",
			day_start: "10:00",
			day_end: "16:00",
			start: today.toISOString().substring(0, 10),
			end: today.toISOString().substring(0, 10),
			contacts: [],
			instructors: [],
			institutions: [],
			program: {
				setup: {
					title: "Setup",
					description: "Get setup with Galaxy before we start",
					trainings: [],
					id: 0,
				},
				// day1: {
				// 	title: "Day 1",
				// 	description: "Galaxy basics",
				// 	trainings: [],
				// 	id: 1,
				// },
			} as CourseSections,
		} as CourseEvent;
		return {
			event: event,
			currentBasket: [] as Array<string>,
			drag: false,
		};
	},
	methods: {
		gtnSort() {
			alert("TODO");
		},
		updateBasket(delta: Tmp) {
			// Check if any day of the program contains this
			let contains = false;
			this.sortedScheduleKeys.forEach((identifier: String) => {
				let section: CourseSection = this.event.program[identifier];	
				section.trainings.forEach((training: CourseSection) => {
					if(training.id === delta.id) {
						contains = true;
					}
				})
			})
			console.log(delta.id, contains);

			if(!contains){
				let last_key = this.sortedScheduleKeys[this.sortedScheduleKeys.length - 1];
				this.event.program[last_key].trainings.push(delta)
			}

			// If it contains
			if (this.currentBasket.filter((item: Tmp) => item.id === delta.id).length > 0) {
				// Remove from basket
				this.currentBasket = this.currentBasket.filter((item: Tmp) => item.id !== delta.id);
			} else {
				this.currentBasket.push(delta);
			}
		},
		updateProgramTitle(key: String, e: Event) {
			let new_title = (e.target as HTMLInputElement).value;
			this.event.program[key].title = new_title; 
			let new_key = new_title.toLowerCase().replace(/ /, '-').replace(/[^a-z0-9-]/g, "");

			if (key !== new_key) {
				Object.defineProperty(this.event.program, new_key, Object.getOwnPropertyDescriptor(this.event.program, key));
				delete this.event.program[key];
			}
		},
		updateProgramDescription(key: String, e: Event) {
			this.event.program[key].description = (e.target as HTMLInputElement).value;
		},
		removeProgramSection(key: String) {
			// @ts-ignore
			let event = this.event as any;

			if (Object.keys(event.program).length > 1) {
				let leftovers = event.program[key].trainings;
				delete event.program[key];
				// What's left
				let first_key = Object.keys(event.program)[0];
				event.program[first_key].trainings = [...event.program[first_key].trainings, ...leftovers];
			}
		},
		addProgramSection() {
			let key = "new-section";
			if (Object.keys(this.event.program).indexOf(key) != -1) {
				key = `${key}-${parseInt("" + (Math.random() * 1000))}`;
			}
			this.event.program[key] = {
				title: "New Section",
				description: "Write something!",
				trainings: [],
				id: Object.keys(this.event.program).length
			};
		},
	},
	computed: {
		sortedScheduleKeys() {
			let keys: Array<any> = Object.keys(this.event.program)
			keys.sort((a, b) => {
				return this.event.program[a].id - this.event.program[b].id;
			});
			return keys 
		}
	}
});
</script>

<template>
	<div class="row">
		<div id="library" class="col-md-3">
			<h3>Library</h3>
			<ModuleList v-bind:basket="currentBasket" @scheduleUpdate="(delta) => updateBasket(delta)" />
		</div>
		<div class="col-md-9">
			<ul class="nav nav-tabs" id="myTab" role="tablist" style="margin-left: 0px">
				<li class="nav-item" role="presentation">
					<TabButton text="Welcome!" />
				</li>
				<li class="nav-item" role="presentation">
					<TabButton text="Reorder Content" />
				</li>
				<li class="nav-item" role="presentation">
					<TabButton text="Schedule" />
				</li>
				<li class="nav-item" role="presentation">
					<TabButton text="Configure Event" />
				</li>
				<li class="nav-item" role="presentation">
					<TabButton text="Export" />
				</li>
				<li class="nav-item" role="presentation">
					<TabButton text="Debug" />
				</li>
			</ul>
			<div class="tab-content" id="myTabContent">
				<Tab :active="true" :id="'welcome'">
					<h2>Welcome to the Course Builder!</h2>
					<p>
						Here you can design your own course from the GTN and Gallantries' Library of Video Content. Follow the steps
						below to build your course
					</p>
					<ol>
						<li>Start by selecting some modules from the left.</li>
						<li>Then re-order your content until you're happy on the next tab.</li>
						<li>Configure the event settings like the title, start and end time, etc.</li>
						<li>Preview the daily schedule.</li>
						<li>And receive a Markdown file that can be contributed back to this repository to host your event.</li>
					</ol>
				</Tab>
				<Tab :id="'reorder-content'">
					<p>Here you can control the ordering of the content in your schedule</p>
					<button class="btn btn-primary" @click="gtnSort">Sort according to GTN Recommended Ordering</button>
					<draggable v-model="currentBasket" group="people" @start="drag = true" @end="drag = false" item-key="name">
						<template #item="{ element }">
							<div class="list-group-item">{{ element.section }}: {{ element.title }}</div>
						</template>
					</draggable>
				</Tab>

				<Tab :id="'schedule'">
					<div v-for="key in sortedScheduleKeys">
						<input
							v-bind:value="event.program[key].title"
							style="font-size: 200%"
							@input="updateProgramTitle(key, $event)"
						/>
						<p>
							<input
								v-bind:value="event.program[key].description"
								@input="updateProgramDescription(key, $event)"
							/>
						</p>
						<draggable
							v-model="event.program[key].trainings"
							group="schedule"
							@start="drag = true"
							@end="drag = false"
							item-key="name"
						>
							<template #item="{ element }">
								<div class="list-group-item">{{ element.section }}: {{ element.title }}</div>
							</template>
						</draggable>
						<div>
							<button class="btn btn-danger" @click="removeProgramSection(key)">Delete</button>
						</div>
					</div>
					<button class="btn btn-secondary" @click="addProgramSection()">Add new section</button>
					<pre>{{ event.program }}</pre>
				</Tab>

				<Tab :id="'configure-event'">
					<!-- <ScheduleSettings :event="event" /> -->
					<BootstrapInput :title="'Event Title'" :value="event.title" @update:value="(newValue) => (event.title = newValue)" />

					<BootstrapInput
						:title="'Description'"
						:help="'A short blurb about your event'"
						:value="event.description"
						@update:value="(newValue) => (event.description = newValue)"
					/>

					<BootstrapInput
						:title="'Location'"
						:help="'Is your location online? Or happening in person somewhere?'"
						:value="event.location"
						@update:value="(newValue) => (event.location = newValue)"
					/>

					<BootstrapDate :title="'Event Start'" :value="event.start" @update:value="(newValue) => (event.start = newValue)" />

					<BootstrapDate :title="'Event End'" :value="event.end" @update:value="(newValue) => (event.end = newValue)" />

					<BootstrapInstructorSelect
						:text="'Trainers'"
						:help="'All of your instructors'"
						:value="event.instructors"
						@update:value="(newValue) => (event.instructors = newValue)"
					/>

					<BootstrapInstructorSelect
						:text="'Contacts'"
						:help="'List which folks participants should contact in case of questions'"
						:value="event.contacts"
						@update:value="(newValue) => (event.contacts = newValue)"
					/>

					<BootstrapInstitutionSelect
						:text="'Affiliated Institutions'"
						:help="'Any institutions that you want to call out specifically'"
						:value="event.institutions"
						@update:value="(newValue) => (event.institutions = newValue)"
					/>

					<pre>{{ event }}</pre>
				</Tab>

				<Tab :id="'export'">
					<VisualiseMarkdown :event="event" />
				</Tab>

				<Tab :id="'debug'">
					<pre>{{ currentBasket }}</pre>
					<pre>{{ event }}</pre>
				</Tab>
			</div>
		</div>
	</div>
</template>

<style>
@import "./assets/base.css";

#app {
	max-width: 1280px;
	margin: 0 auto;
	padding: 2rem;

	font-weight: normal;
}
</style>
