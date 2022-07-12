<script lang="ts">
import ModuleList from "./components/ModuleList.vue";
import TabButton from "./components/TabButton.vue";
import Tab from "./components/Tab.vue";
import ScheduleSettings from "./components/Settings.vue";
import VisualiseMarkdown from "./components/VisualiseMarkdown.vue";
import type { CourseEvent } from "./interface.js";
import draggable from "vuedraggable";

export default {
	components: {
		ModuleList,
		TabButton,
		Tab,
		ScheduleSettings,
		VisualiseMarkdown,
		draggable,
	},
	data() {
		let event: CourseEvent = {
			layout: "event",
			title: "My Awesome Event",
			description: "Best training since bread slicing lessons",
			instructors: ["bob", "alice"],
			program: {
				day1: {
					title: "Day 1",
					description: "Intro",
					trainings: [{ video: "test" }],
				},
			},
		};
		return {
			event: event,
			currentBasket: ["session:webinars"] as Array<string>,
			drag: false,
		};
	},
	methods: {
		updateBasket(delta: string) {
			// @ts-ignore
			if(this.currentBasket.indexOf(delta) > -1){
				// Remove from basket
				// @ts-ignore
				this.currentBasket = this.currentBasket.filter(item => item !== delta);
			} else {
				// @ts-ignore
				this.currentBasket.push(delta);
			}
			// @ts-ignore
			console.log("changed", delta, this.currentBasket);
		}
	}
	// watch: {
	// 	currentBasket() {
	// 		console.log("Basket changed")
	// 	}
	// }
};
</script>

<template>
	<div class="row">
		<div id="library" class="col-md-3">
			<h3>Library</h3>
			<ModuleList v-bind:basket="currentBasket" @scheduleUpdate="(delta) => updateBasket(delta)"/>
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
					<draggable 
  v-model="currentBasket" 
  group="people" 
  @start="drag=true" 
  @end="drag=false" 
  item-key="name">
  <template #item="{element}">
    <div class="list-group-item">{{element.title}}</div>
   </template>
</draggable>

				</Tab>

				<Tab :id="'schedule'">
					<ScheduleSettings />
				</Tab>

				<Tab :id="'configure-event'"> Configure </Tab>

				<Tab :id="'export'">
					<VisualiseMarkdown :event="event" />
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
