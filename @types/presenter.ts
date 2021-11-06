export interface Presenter {
  /** A unique identifier for the presenter */
  readonly id: string;

  /** The presenter's first name */
  readonly firstName: string;

  /** The presenter's last name */
  readonly lastName: string;

  /** The presenter's email address */
  readonly email: string;

  /** The URL to the presenters profile photo */
  readonly profileImage: string;

  /** A list of presentations the presenter has created in Ngosi */
  readonly presentations: Presentation[];
}

export interface Presentation {
  /** A unique identifier for a presentation */
  readonly id: string;

  /** The ID of the presenter who created this presentation */
  readonly presenter: string;

  /** The name of the presentation */
  readonly title: String;

  /** The location where the live talk took place */
  readonly location?: String;

  /** The name of the conf or event where the presentation was given */
  readonly eventName: string;
}
