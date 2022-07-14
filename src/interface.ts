export type CourseItem = {
	id: string; // session:blah
	title: string; // My Session
	section: string; // session
};

export type CourseItemBasics = {
	basics: string;
	id: string | undefined; // session:blah
	title: string | undefined; // My Session
	section: string | undefined; // session
};

export type CourseItemVideo = {
	video: string;
	id: string | undefined; // session:blah
	title: string | undefined; // My Session
	section: string | undefined; // session
};

export type CourseItemSession = {
	session: string;
	id: string | undefined; // session:blah
	title: string | undefined; // My Session
	section: string | undefined; // session
};

export type CourseItemSelfStudy = {
	"self-study": string;
	id: string | undefined; // session:blah
	title: string | undefined; // My Session
	section: string | undefined; // session
};

export type CourseItemOptions =
	| CourseItemVideo
	| CourseItemSession
	| CourseItemBasics
	| CourseItemSelfStudy;

export function getCourseItemKey(item: CourseItemOptions): string | null {
	if ("basics" in item) {
		return `basics:${item.basics}`;
	} else if ("video" in item) {
		return `video:${item.video}`;
	} else if ("session" in item) {
		return `session:${item.session}`;
	} else if ("self-study" in item) {
		return `self-study:${item["self-study"]}`;
	}
	return null;
}

export function convertCourseItemToCourseItemOption(
	item: CourseItem
): CourseItemOptions | null {
	// Any extra properties to preserve
	const extra_props: Array<string> = Object.keys(item).filter(
		(x) => x !== "id"
	);
	if (item.section == "basics") {
		const res = {
			basics: item.id.split(":")[1],
		} as CourseItemBasics;
		// meh
		extra_props.forEach(
			(x) => ((res as any)[x] = (item as any)[x])
		);
		return res;
	} else if (item.section == "session") {
		const res = {
			session: item.id.split(":")[1],
		} as CourseItemSession;
		// meh
		extra_props.forEach(
			(x) => ((res as any)[x] = (item as any)[x])
		);
		return res;
	} else if (item.section == "video") {
		const res = {
			video: item.id.split(":")[1],
		} as CourseItemVideo;
		// meh
		extra_props.forEach(
			(x) => ((res as any)[x] = (item as any)[x])
		);
		return res;
	} else if (item.section == "self-study") {
		const res = {
			"self-study": item.id.split(":")[1],
		} as CourseItemSelfStudy;
		// meh
		extra_props.forEach(
			(x) => ((res as any)[x] = (item as any)[x])
		);
		return res;
	}
	return null;
}

export type CourseSection = {
	/**
	 * Title of the section
	 */
	title: string;
	id: number;
	description: string | null;
	trainings: Array<CourseItemOptions>;
};

export type CourseSections = {
	[key: string]: CourseSection;
};

export type CourseEvent = {
	/**
	 * Must be set to 'event'
	 */
	layout: string;
	/**
	 * Event title
	 */
	title: string;
	/**
	 * Short description of the event
	 */
	description: string;
	/**
	 * List of instructors
	 */
	instructors: Array<string>;
	contacts: Array<string>;
	institutions: Array<string>;
	/**
	 * List of CourseSections
	 */
	program: CourseSections;

	/**
	 * Location of the event
	 */
	location: string;
	cost: string;
	audience: string;
	format: string;
	date: any;
	// start: string;
	// end: string;
};
