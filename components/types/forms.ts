export interface PresentationDownloadForm {
  fullname: string;
  email: string;
  notificationWhenVideoPublished: boolean;
  rateMyPresentation: boolean;
  notificationOfOtherTalks: boolean;
}

export interface SlidesUrlForm {
  /** The URL to access the presener's slides */
  slides: string;
}
