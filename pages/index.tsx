import { NextPage } from 'next'
import Image from 'next/image'
import Script from 'next/script'

const Home: NextPage = () => {
  return (
    <>
      <Script
        src="https://cdn.onesignal.com/sdks/OneSignalSDK.js"
        strategy="beforeInteractive"
      ></Script>

      <div className="prose mt-5">
        <div>
          <div className="float-right">
            <Image src="/images/ngosi.png" width={200} height={200} alt="" />
          </div>
          <h1>ngosi</h1>
          <p>
            ngosi enables trainers, lecturers, and other continuing education
            professionals to engage and empower their audiences.
          </p>
        </div>
        <div className="clear-both">
          <h1>Share Content</h1>
          <p>
            Share lectures, workshops, and other presentation materials with
            your audience digitally. No more emailing for slides. Get your team
            signed up today!
          </p>
          <h1>Collect Feedback</h1>
          <p>
            Solicit ratings and commentary that enable you to constructively
            improve your materials. A little bit better every day.
          </p>
          <h1>Engage Audiences</h1>
          <p>
            Engage audiences after events by offering promotions, referrals, and
            information about upcoming events. Continue your continuing
            educational offerings with thoughtful customer engagement.
          </p>
        </div>
        <div className="pt-20">
          <h1>Spread Love</h1>
          <div className="shadow-lg m-5 pr-10 text-right">
            &quot;amazeballs&quot; &mdash; Jeff
          </div>
          <div className="shadow-lg m-5 pr-10 text-right">
            &quot;tweets cool&quot; &mdash; Yann
          </div>
          <div className="shadow-lg m-5 pr-10 text-right">
            &quot;errbody likes it&quot; &mdash;Jordan
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
