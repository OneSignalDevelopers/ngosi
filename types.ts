declare global {
  interface window {
    Onesignal: any
  }
}

export interface Profile {
  /** A unique identifier for the presenter */
  readonly id: string

  /** The presenter's email address also their username*/
  readonly email: string

  /** The URL to the presenters profile photo */
  readonly avatar_url?: string

  /** The user's personal website */
  readonly website?: string

  /** The time the presenter account was updated. */
  readonly updatedAt?: string
}

export type PresenterHeader = Omit<Profile, 'id' | 'updatedAt'>

export type PresenterSignupForm = Omit<Profile, 'id' | 'updatedAt'>

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

  /** The location where the published video or other content can be found. */
  readonly publishedContentUrl?: string

  /** The time the presentation was created. */
  readonly createdAt?: string

  /** The time the presentation was updated. */
  readonly updatedAt?: string
}

export type PresoForm = Omit<
  Preso,
  'id' | 'shortCode' | 'createdAt' | 'updatedAt'
>

export type PresoDetails = Omit<Preso, 'id' | 'userId' | 'shortCode'>

export interface Survey {
  /** Just an ID for internal use. */
  readonly id: string

  /** The presentation this response is for */
  readonly presoId: string

  /** The attendee whose response is this survey */
  readonly attendeeId: string

  /** Indicates if the survey respondent
   * should be sent an email when
   * the recording of the presentation
   * is published by the event host.
   * */
  readonly notifyWhenVideoPublished: boolean

  /** Indicates if the survey respondent
   * should be sent an SMS with a
   * link to a feedback form a few
   * minutes after the live talk
   * is scheduled to conclude.
   */
  readonly sendPresoFeedback: boolean

  /** Indicates if the survey respondent
   * should be notified whenever
   * the presenter presents again.
   */
  readonly notifyOfOtherTalks: boolean

  /** The time the survey was completed. */
  readonly createdAt?: string
}

export type SurveyForm = Omit<Survey, 'id' | 'attendeeId' | 'createdAt'>

export type SurveyFormResponse = {
  readonly email: string
  readonly fullName: string
} & SurveyForm

export interface Profile {
  readonly id: string
  readonly username: string
  readonly firstName: string
  readonly lastName: string
  readonly email: string
  readonly website?: string
  readonly avatar_url?: string
  readonly createdAt?: string
  readonly UpdatedAt?: string
}

export interface Attendee {
  readonly id: string
  readonly fullName: string
  readonly email: string
}
