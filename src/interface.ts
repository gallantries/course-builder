export type CourseItem = {
  [key: string]: string
}

export type CourseSection = {
  /**
   * Title of the section
   */
  title: string,
  description: string,
  trainings: Array<CourseItem>,
}

export type CourseSections = {
  [key: string]: CourseSection
}

export type CourseEvent = {
  /**
   * Must be set to 'event'
   */
  layout: string,
  /**
   * Event title
   */
  title: string,
  /**
   * Short description of the event
   */
  description: string,
  /**
   * List of instructors
   */
  instructors: Array<String>,
  /**
   * List of CourseSections
   */
  program: CourseSections,
};