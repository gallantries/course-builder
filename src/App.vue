<script lang="ts">
import ModuleList from "./components/ModuleList.vue";
import TabButton from "./components/TabButton.vue";
import Tab from "./components/Tab.vue";
import ScheduleSettings from "./components/ScheduleSettings.vue";
import VisualiseMarkdown from "./components/VisualiseMarkdown.vue";
import type {
        CourseEvent,
        CourseSection,
        CourseSections,
} from "./interface.js";
import {
        getCourseItemKey,
        convertCourseItemToCourseItemOption,
} from "@/interface";
import draggable from "vuedraggable";
import BootstrapInput from "./components/BootstrapInput.vue";
import BootstrapInstructorSelect from "./components/BootstrapInstructorSelect.vue";
import BootstrapInstitutionSelect from "./components/BootstrapInstitutionSelect.vue";
import BootstrapTime from "./components/BootstrapTime.vue";
import BootstrapDate from "./components/BootstrapDate.vue";
import VideoLibraryDataService from "@/services/VideoLibraryDataService";
import { defineComponent } from "vue";
import { processExpression } from "@vue/compiler-core";

interface CourseItem {
        id: string; // session:blah
        title: string; // My Session
        section: string; // session
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
                const today = new Date();
                const program: CourseSections = {
                        // setup: {
                        // 	title: "Setup",
                        // 	description: "Get setup with Galaxy before we start",
                        // 	trainings: [],
                        // 	id: 0,
                        // },
                };
                const event: CourseEvent = {
                        layout: "event",
                        title: "My Awesome Event",
                        location: "Online",
                        cost: "free",
                        audience: "Open for all, but target audience is clinicians and researchers",
                        description:
                                "Best training since bread slicing lessons",
                        format: "Asynchronous; all training sessions are pre-recorded and provided in advance",
                        date: {
                                start: today.toISOString().substring(0, 10),
                                end: today.toISOString().substring(0, 10),
                        },
                        contacts: [],
                        instructors: [],
                        institutions: [],
                        program: program,
                };
                return {
                        loading: true,
                        event: event,
                        currentBasket: [] as Array<string>,
                        drag: false,
                        videoList: Map<string, any>,
                        sessionList: [] as any[],
                        basicsList: [
                                "setup",
                                "setup-gat",
                                "code-of-conduct",
                                "certificates",
                                "logistics",
                                "feedback",
                        ],
                        // @ts-ignore
                        version: __COMMIT_HASH__
                                .replace(/\n/, "")
                                .replace(/\s*/, ""),
                };
        },
        methods: {
                gtnSort() {
                        alert("TODO");
                },
                updateBasket(delta: CourseItem) {
                        // Check if any day of the program contains this
                        let containing_section = null;
                        this.sortedScheduleKeys.forEach(
                                (identifier: string) => {
                                        const section: CourseSection =
                                                this.event.program[identifier];
                                        section.trainings.forEach(
                                                (training) => {
                                                        if (
                                                                getCourseItemKey(
                                                                        training,
                                                                ) === delta.id
                                                        ) {
                                                                containing_section =
                                                                        identifier;
                                                        }
                                                },
                                        );
                                },
                        );

                        if (containing_section === null) {
                                // Add it to the last section
                                const last_key =
                                        this.sortedScheduleKeys[
                                                this.sortedScheduleKeys.length -
                                                        1
                                        ];
                                this.event.program[last_key].trainings.push(
                                        convertCourseItemToCourseItemOption(
                                                delta,
                                        )!,
                                );
                        } else {
                                // Figure out where it is, and remove it.
                                this.event.program[
                                        containing_section
                                ].trainings = this.event.program[
                                        containing_section
                                ].trainings.filter((training) => {
                                        return (
                                                getCourseItemKey(training) !==
                                                delta.id
                                        );
                                });
                        }

                        // If it contains
                        // if (this.currentBasket.filter((item: Tmp) => item.id === delta.id).length > 0) {
                        // 	// Remove from basket
                        // 	this.currentBasket = this.currentBasket.filter((item: Tmp) => item.id !== delta.id);
                        // } else {
                        // 	this.currentBasket.push(delta);
                        // }
                },
                updateProgramTitle(key: string, e: Event) {
                        const new_title = (e.target as HTMLInputElement).value;
                        this.event.program[key].title = new_title;
                        const new_key = new_title
                                .toLowerCase()
                                .replace(/ /, "-")
                                .replace(/[^a-z0-9-]/g, "");

                        if (key !== new_key) {
                                Object.defineProperty(
                                        this.event.program,
                                        new_key,
                                        // All of these !s to avoid potentially null
                                        // data. We know it exists, if it doesn't, we
                                        // have bigger issues.
                                        Object.getOwnPropertyDescriptor(
                                                this.event.program,
                                                key,
                                        )!,
                                );
                                delete this.event.program[key];
                        }
                },
                updateProgramDescription(key: string, e: Event) {
                        this.event.program[key].description = (
                                e.target as HTMLInputElement
                        ).value;
                },
                removeProgramSection(key: string) {
                        // @ts-ignore
                        const event = this.event as any;

                        if (Object.keys(event.program).length > 1) {
                                const leftovers = event.program[key].trainings;
                                delete event.program[key];
                                // What's left
                                const first_key = Object.keys(event.program)[0];
                                event.program[first_key].trainings = [
                                        ...event.program[first_key].trainings,
                                        ...leftovers,
                                ];
                        }
                },
                unKebab(value: string) {
                        return value
                                .split("-")
                                .map(
                                        (x) =>
                                                x.charAt(0).toUpperCase() +
                                                x.slice(1),
                                )
                                .join(" ");
                },
                addProgramSection() {
                        let key = "new-section";
                        if (
                                Object.keys(this.event.program).indexOf(key) !=
                                -1
                        ) {
                                key = `${key}-${parseInt(
                                        "" + Math.random() * 1000,
                                )}`;
                        }
                        this.event.program[key] = {
                                title: "New Section",
                                description: "Write something!",
                                trainings: [],
                                id: Object.keys(this.event.program).length,
                        };
                },
        },
        computed: {
                sortedScheduleKeys() {
                        const keys: Array<any> = Object.keys(
                                this.event.program,
                        );
                        keys.sort((a, b) => {
                                return (
                                        this.event.program[a].id -
                                        this.event.program[b].id
                                );
                        });
                        return keys;
                },
        },
        mounted() {
                this.loading = true;
                // Load metadata
                VideoLibraryDataService.getVideosByTags().then((res) => {
                        this.videoList = res.data;
                        // And sessions
                        VideoLibraryDataService.getSessions().then((res) => {
                                this.sessionList = res.data;

                                // If we've got a private thing then
                                const params = new URLSearchParams(
                                        document.location.search,
                                );
                                let event = params.get("event"); // is the string "Jonathan"
                                if (event !== null) {
                                        if (event.startsWith("/")) {
                                                event = event.substring(1);
                                        }
                                        console.log(event);
                                        VideoLibraryDataService.getEvent(
                                                event,
                                        ).then((res) => {
                                                this.event = res.data;
                                                if (
                                                        this.event.program ===
                                                        undefined
                                                ) {
                                                        this.event.program = {
                                                                // setup: {
                                                                // 	title: "Setup",
                                                                // 	description: "Get setup with Galaxy before we start",
                                                                // 	trainings: [],
                                                                // 	id: 0,
                                                                // },
                                                        };
                                                }
                                                console.log(this.event);
                                                Object.keys(
                                                        this.event.program,
                                                ).forEach((section, index) => {
                                                        this.event.program[
                                                                section
                                                        ].id = index;

                                                        this.event.program[
                                                                section
                                                        ].trainings = this.event.program[
                                                                section
                                                        ].trainings.map(
                                                                (cio) => {
                                                                        const key =
                                                                                getCourseItemKey(
                                                                                        cio,
                                                                                );
                                                                        if (
                                                                                key ===
                                                                                        undefined ||
                                                                                key ===
                                                                                        null
                                                                        ) {
                                                                                return cio;
                                                                        }

                                                                        const key_parts =
                                                                                key.split(
                                                                                        ":",
                                                                                );
                                                                        cio.id =
                                                                                key_parts?.join(
                                                                                        ":",
                                                                                );
                                                                        cio.section =
                                                                                key_parts[0];
                                                                        function findInVideoListByKey(
                                                                                searchKey: string,
                                                                                videoList: any,
                                                                        ) {
                                                                                let res;
                                                                                Object.keys(
                                                                                        videoList,
                                                                                ).forEach(
                                                                                        (
                                                                                                section,
                                                                                        ) => {
                                                                                                Object.keys(
                                                                                                        videoList[
                                                                                                                section
                                                                                                        ]
                                                                                                                .videos,
                                                                                                ).forEach(
                                                                                                        (
                                                                                                                videoKey,
                                                                                                        ) => {
                                                                                                                if (
                                                                                                                        videoKey ===
                                                                                                                        searchKey
                                                                                                                ) {
                                                                                                                        res =
                                                                                                                                videoList[
                                                                                                                                        section
                                                                                                                                ]
                                                                                                                                        .videos[
                                                                                                                                        videoKey
                                                                                                                                ];
                                                                                                                }
                                                                                                        },
                                                                                                );
                                                                                        },
                                                                                );
                                                                                return res;
                                                                        }

                                                                        if (
                                                                                key_parts &&
                                                                                key_parts[0] ===
                                                                                        "video"
                                                                        ) {
                                                                                const vid =
                                                                                        findInVideoListByKey(
                                                                                                key_parts[1],
                                                                                                this
                                                                                                        .videoList,
                                                                                        );
                                                                                cio.title =
                                                                                        (
                                                                                                vid as any
                                                                                        ).title;
                                                                        } else if (
                                                                                key_parts &&
                                                                                key_parts[0] ===
                                                                                        "session"
                                                                        ) {
                                                                                cio.title =
                                                                                        (
                                                                                                this
                                                                                                        .sessionList as any
                                                                                        )[
                                                                                                key_parts[1]
                                                                                        ].title;
                                                                        } else if (
                                                                                key_parts &&
                                                                                key_parts[0] ===
                                                                                        "basics"
                                                                        ) {
                                                                                cio.title =
                                                                                        this.unKebab(
                                                                                                key_parts[1],
                                                                                        );
                                                                        }
                                                                        return cio;
                                                                },
                                                        );
                                                });
                                                this.loading = false;
                                        });
                                } else {
                                        this.loading = false;
                                }
                        });
                });
        },
});
</script>

<template>
        <div class="row">
                <div id="library" class="col-md-3">
                        <h3>Library</h3>
                        <ModuleList
                                v-bind:basket="event.program"
                                v-bind:videoList="videoList"
                                v-bind:sessionList="sessionList"
                                v-bind:basicsList="basicsList"
                                @scheduleUpdate="(delta) => updateBasket(delta)"
                        />
                </div>
                <div class="col-md-9">
                        <ul
                                class="nav nav-tabs"
                                id="myTab"
                                role="tablist"
                                style="margin-left: 0px"
                        >
                                <li class="nav-item" role="presentation">
                                        <TabButton
                                                text="Welcome!"
                                                :active="true"
                                        />
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
                                <!-- <li class="nav-item" role="presentation">
					<TabButton text="Debug" />
				</li> -->
                        </ul>
                        <div class="tab-content" id="myTabContent">
                                <Tab :active="true" :id="'welcome'">
                                        <h2>Welcome to the Course Builder!</h2>
                                        <p>
                                                Here you can design your own
                                                course from the GTN and
                                                Gallantries' Library of Video
                                                Content. Follow the steps below
                                                to build your course
                                        </p>
                                        <ol>
                                                <li>
                                                        Start by selecting some
                                                        modules from the left.
                                                </li>
                                                <li>
                                                        Then re-order your
                                                        content until you're
                                                        happy on the next tab.
                                                </li>
                                                <li>
                                                        Configure the event
                                                        settings like the title,
                                                        start and end time, etc.
                                                </li>
                                                <li>
                                                        And receive a Markdown
                                                        file that can be
                                                        contributed back to this
                                                        repository to host your
                                                        event.
                                                </li>
                                        </ol>

                                        <p>
                                                Course Builder Version:
                                                <a
                                                        :href="
                                                                'https://github.com/gallantries/course-builder/commit/' +
                                                                version
                                                        "
                                                        >{{ version }}</a
                                                >
                                                | License
                                                <a
                                                        href="https://github.com/gallantries/course-builder/blob/main/LICENSE.txt"
                                                        >AGPL-3.0</a
                                                >
                                        </p>
                                </Tab>

                                <Tab :id="'schedule'">
                                        <div v-for="key in sortedScheduleKeys">
                                                <BootstrapInput
                                                        :title="'Module Title'"
                                                        :help="'Something like Setup or Day 1'"
                                                        v-model="
                                                                event.program[
                                                                        key
                                                                ].title
                                                        "
                                                />
                                                <p>
                                                        <BootstrapInput
                                                                :title="'Description'"
                                                                :help="'What will be covered in this section?'"
                                                                v-model="
                                                                        event
                                                                                .program[
                                                                                key
                                                                        ]
                                                                                .description
                                                                "
                                                        />
                                                </p>
                                                <draggable
                                                        v-model="
                                                                event.program[
                                                                        key
                                                                ].trainings
                                                        "
                                                        group="schedule"
                                                        @start="drag = true"
                                                        @end="drag = false"
                                                        item-key="name"
                                                >
                                                        <template
                                                                #item="{
                                                                        element,
                                                                }"
                                                        >
                                                                <div
                                                                        v-if="
                                                                                element.section
                                                                        "
                                                                        class="list-group-item"
                                                                >
                                                                        {{
                                                                                element.section
                                                                        }}:
                                                                        <span
                                                                                v-if="
                                                                                        element.title
                                                                                "
                                                                                >{{
                                                                                        element.title
                                                                                }}</span
                                                                        ><span
                                                                                v-else
                                                                                >{{
                                                                                        element.id
                                                                                }}</span
                                                                        >
                                                                </div>
                                                                <div
                                                                        v-else
                                                                        class="list-group-item"
                                                                >
                                                                        {{
                                                                                element
                                                                        }}
                                                                </div>
                                                        </template>
                                                </draggable>
                                                <div>
                                                        <button
                                                                class="btn btn-danger"
                                                                @click="
                                                                        removeProgramSection(
                                                                                key,
                                                                        )
                                                                "
                                                        >
                                                                Delete
                                                        </button>
                                                </div>
                                        </div>
                                        <button
                                                class="btn btn-secondary"
                                                @click="addProgramSection()"
                                        >
                                                Add new section
                                        </button>
                                </Tab>

                                <Tab :id="'configure-event'">
                                        <!-- <ScheduleSettings :event="event" /> -->
                                        <BootstrapInput
                                                :title="'Event Title'"
                                                v-model="event.title"
                                        />

                                        <BootstrapInput
                                                :title="'Description'"
                                                :help="'A short blurb about your event'"
                                                v-model="event.description"
                                        />

                                        <BootstrapInput
                                                :title="'Location'"
                                                :help="'Is your location online? Or happening in person somewhere?'"
                                                v-model="event.location"
                                        />

                                        <BootstrapDate
                                                :title="'Event Start'"
                                                v-model="event.date.start"
                                        />

                                        <BootstrapDate
                                                :title="'Event End'"
                                                v-model="event.date.end"
                                        />

                                        <BootstrapInstructorSelect
                                                :text="'Trainers'"
                                                :help="'All of your instructors'"
                                                v-model="event.instructors"
                                        />

                                        <BootstrapInstructorSelect
                                                :text="'Contacts'"
                                                :help="'List which folks participants should contact in case of questions'"
                                                v-model="event.contacts"
                                        />

                                        <BootstrapInstitutionSelect
                                                :text="'Affiliated Institutions'"
                                                :help="'Any institutions that you want to call out specifically'"
                                                v-model="event.institutions"
                                        />
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
#app {
        max-width: 1280px;
        margin: 0 auto;
        padding: 2rem;

        font-weight: normal;
}

.draggable {
        background: #ccc;
}
</style>
