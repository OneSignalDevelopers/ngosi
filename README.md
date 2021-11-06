## What is it?

Ngosi is a tool that aims to make it easy to share you presentation with a live audience and (building a list).

## How does it work?

- A presenter lands on the site where they will be asked for a link to their presentation
- Ngosi will generate a QR code and associate it with a URL that _knows_ about the link to the presentation
- The presenter is expected to put the generated QR code in their presenation
- Audience members watching the talk can scan the QR code and be taken to the presenter's _talk_ in ngosi
- Audience member fills out a form for the slides, their response is then logged in the email list

The presenter's _talk_ page will present a short form survey to be completed before taking them to the presentation materials.

The form survey will ask for some information:

1. Name
2. Email
3. City/Country\*\*
4. Whether to receive notification when the video of the talk goes live
5. Whether to send a follow-up survey after the presenter concludes their live talk to give feedback
6. Whether to be notified when this presenter gives a talk in the future

## Yea, but why?

I needed a _real_ project in which to demonstrate the power of [OneSignal](). The product direction is guided mostly by the messaging workflows OneSignal excels at.

I've not gone to a single conference where someone either asked for the slides or decided to take pictures of the slides during the presentation. If you're going to share the slides, why not also collect some info so you can own your own audience?

## Getting Started

First, install dependencies:

```bash
yarn
```

Then, run the development server:

```bash
yarn dev
```
