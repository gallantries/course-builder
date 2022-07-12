export type CourseItem = {
  [key: string]: string;
};

export type CourseSection = {
  /**
   * Title of the section
   */
  title: string;
  id: Number;
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
  start: Date;
  end: Date;
};