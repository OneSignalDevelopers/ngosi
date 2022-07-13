<img src="https://user-images.githubusercontent.com/1715082/140621829-ba80f963-840c-4be4-abe5-7167b8edc906.png" height="250px"/>

## What is it?

Ngosi is an application that enables software developer influencers to measure, manage, and engage with their audience.

Software developer influencers are notable software engineers, engineering leaders, developer advocates, or sales/marketing representatives from organizations that target developers as customers. Influencers typcally engage with their audience on social media, at conferences, on reddit/slack/discord and other online communities.

## Features (MVP)

- Collect feedback on a presentation given at conf or meetup
- Share upcoming events for influencers
- Share historical presentations with links to video and other resources
- Get feedback on your presentations
- Notify your audience of upcoming events or when you publish a new content

## Getting Started

Running Ngosi requires that you have the following tools installed on your system:

- [Supabase CLI](https://github.com/supabase/cli#getting-started)

### Setup Your Env

Open the project in your text editor and copy the `.env.example` file and rename it to `.env.local` before setting each variable.

| Variable                        | Purpose / how to get value                                                                   |
| ------------------------------- | -------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_PUBLIC_URL`        | The hostname where Ngosi is being hosted                                                     |
| `NEXT_PUBLIC_ONESIGNAL_APP_ID`  | The OneSignal app ID available on the OneSignal Dashboard (May need to create the app first) |
| `NEXT_PUBLIC_SUPABASE_URL`      | This is the `API URL` returned by Supabase upon start                                        |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | This is the `anon key` returned by Supabase upon start                                       |


### Start Supabase

```bash
supabase start
```

Note that :point_up: prints the values you'll need for local development.

```bash
Started local development setup.

API URL: http://localhost:54321
DB URL: postgresql://postgres:postgres@localhost:54322/postgres
Studio URL: http://localhost:54323
Inbucket URL: http://localhost:54324
anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiJ9.ZopqoUt20nEV9cklpv9e3yw3PVyZLmKs5qLD6nGL1SI
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIn0.M2d2z4SFn5C7HlJlaSLfrzuYim9nbY_XI40uWFN3hEE
```

Once supacebase is up, you'll need to create the database by executing the `db.sql` script with your postgres client. If you don't have a client installed, consider using [pgcli](https://www.pgcli.com/).


### Start the Project

First, install the project dependencies:

```bash
yarn
```

Finally, start the development server:

```bash
yarn dev
```

#### How to retrieve magic link email link

When developing locally, emails will not be sent to an external server; however, supabase provides [this website to view emails](http://localhost:54324/monitor) that would be sent if hosted on production.

## Misc

- Font - Lato italic
- Ngosi green - #77bb3f
