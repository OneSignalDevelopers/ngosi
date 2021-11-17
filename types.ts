export interface Presenter {
  /** A unique identifier for the presenter */
  readonly id: string

  /** The presenter's first name */
  readonly firstName: string

  /** The presenter's last name */
  readonly lastName: string

  /** The presenter's email address */
  readonly email: string

  /** The URL to the presenters profile photo */
  profileImage?: string

  /** A list of presentations the presenter has created in Ngosi */
  readonly presentations: Preso[]
}

export interface Preso {
  /** The publically visible unique identifier for the presentation.  */
  readonly shortCode: string

  /** The name of the presentation. */
  readonly title: string

  /** The location where the event took place. */
  readonly eventLocation?: string

  /** The name of the event where the presentation was given. */
  readonly eventName: string

  /** The url where the presentation can be found. */
  readonly url: string
}

export interface SurveyForm {
  /** The survey respondent's first and last name. */
  fullname: string

  /** The survey respondent's email address. */
  email: string

  /** Indicates if the survey respondent
   * should be sent an email when
   * the recording of the presentation
   * is published by the event host.
   * */
  notificationWhenVideoPublished: boolean

  /** Indicates if the survey respondent
   * should be sent an SMS with a
   * link to a feedback form a few
   * minutes after the live talk
   * is scheduled to conclude.
   */
  rateMyPresentation: boolean

  /** Indicates if the survey respondent
   * should be notified whenever
   * the presenter presents again.
   */
  notificationOfOtherTalks: boolean
}

export interface PresoForm {
  /** The Url where the presener's slides are located */
  url: string
}
