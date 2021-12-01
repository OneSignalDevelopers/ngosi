declare global {
  interface window {
    Onesignal: any
  }
}

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
  readonly profileImage?: string

  /** A list of presentations the presenter has created in Ngosi */
  readonly presentations: Preso[]

  /** The time the presenter account was created. */
  readonly createdAt?: string

  /** The time the presenter account was updated. */
  readonly updatedAt?: string
}

export type PresenterHeader = Omit<
  Presenter,
  'id' | 'presentations' | 'email' | 'createdAt' | 'updatedAt'
>

export type PresenterSignupForm = Omit<
  Presenter,
  'id' | 'presentations' | 'createdAt' | 'updatedAt'
>

export interface Preso {
  /** Just an ID for internal use. */
  readonly id: string

  /** The name of the presentation. */
  readonly title: string

  /** The Url where the presener's slides are located */
  readonly url: string

  /** The Id of the user who created this preso */
  readonly userId: string

  /** The publically visible unique identifier for the presentation.  */
  readonly shortCode: string

  /** The name of the event where the presentation was given. */
  readonly eventName: string

  /** The location where the event took place. */
  readonly eventLocation?: string

  /** The time the presentation was created. */
  readonly createdAt?: string

  /** The time the presentation was updated. */
  readonly updatedAt?: string
}

export type PresoForm = Omit<
  Preso,
  'id' | 'shortCode' | 'createdAt' | 'updatedAt'
>

export interface Survey {
  /** Just an ID for internal use. */
  readonly id: string

  /** The survey respondent's first and last name. */
  readonly fullName: string

  /** The survey respondent's email address. */
  readonly email: string

  /** Indicates if the survey respondent
   * should be sent an email when
   * the recording of the presentation
   * is published by the event host.
   * */
  readonly notificationWhenVideoPublished: boolean

  /** Indicates if the survey respondent
   * should be sent an SMS with a
   * link to a feedback form a few
   * minutes after the live talk
   * is scheduled to conclude.
   */
  readonly rateMyPresentation: boolean

  /** Indicates if the survey respondent
   * should be notified whenever
   * the presenter presents again.
   */
  readonly notificationOfOtherTalks: boolean

  /** The time the survey was completed. */
  readonly createdAt?: string
}

export type SurveyForm = Omit<Survey, 'id' | 'createdAt'>
