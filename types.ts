export interface Presenter {
  /** A unique identifier for the presenter */
  id: string

  /** The presenter's first name */
  firstName: string

  /** The presenter's last name */
  lastName: string

  /** The presenter's email address */
  email: string

  /** The URL to the presenters profile photo */
  profileImage?: string

  /** A list of presentations the presenter has created in Ngosi */
  presentations: Preso[]

  createdAt?: string
  updatedAt?: string
}

export type PresenterSignupForm = Omit<
  Presenter,
  'id' | 'presentations' | 'createdAt' | 'updatedAt'
>

export interface Preso {
  /** Just an ID for internal use. */
  id: string

  /** The name of the presentation. */
  title: string

  /** The Url where the presener's slides are located */
  url: string

  /** The publically visible unique identifier for the presentation.  */
  shortCode: string

  /** The name of the event where the presentation was given. */
  eventName: string

  /** The location where the event took place. */
  eventLocation?: string

  createdAt?: string
  updatedAt?: string
}

export type PresoForm = Omit<
  Preso,
  'id' | 'shortCode' | 'createdAt' | 'updatedAt'
>

export interface Survey {
  /** Just an ID for internal use. */
  id: string

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

  createdAt?: string
  updatedAt?: string
}

export type SurveyForm = Omit<Survey, 'id' | 'createdAt' | 'updatedAt'>
