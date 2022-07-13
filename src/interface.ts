export type CourseItem = {
	id: string; // session:blah
	title: string; // My Session
	section: string; // session
};

export type CourseSection = {
	/**
	 * Title of the section
	 */
	title: string;
	id: number;
	description: string;
	trainings: Array<CourseItem>;
};

export type CourseSections = {
	[key: string]: CourseSection;
};

export type CourseEvent = {
	/**
	 * Must be set to 'event'
	 */
	layout: String;
	/**
	 * Event title
	 */
	title: String;
	/**
	 * Short description of the event
	 */
	description: String;
	/**
	 * List of instructors
	 */
	instructors: Array<String>;
	contacts: Array<String>;
	institutions: Array<String>;
	/**
	 * List of CourseSections
	 */
	program: CourseSections;

	/**
	 * Location of the event
	 */
	location: String;
	cost: String;
	audience: String;
	start: String;
	end: String;
	format: String;
};
