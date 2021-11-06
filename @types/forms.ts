export interface SurveyForm {
  fullname: string;
  email: string;
  notificationWhenVideoPublished: boolean;
  rateMyPresentation: boolean;
  notificationOfOtherTalks: boolean;
}

export interface AddPresentationForm {
  /** The URL to access the presener's slides */
  url: string;
}
