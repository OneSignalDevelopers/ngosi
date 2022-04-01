import { useSupabase } from '@common/supabaseProvider'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Home: NextPage = () => {
  const router = useRouter()

  return (
    <>
      <Head>
        <script
          src="https://cdn.onesignal.com/sdks/OneSignalSDK.js"
          async
        ></script>
      </Head>
      <div className="prose mt-5">
          <div>
              <img className="float-right" src="/images/ngosi.png" />
              <h1>ngosi</h1>
              <p>ngosi enables trainers, lecturers, and other continuing education professionals to engage and empower their audiences.</p>
          </div>
          <div className="clear-both">
              <h1>Share Content</h1>
              <p>Share lectures, workshops, and other presentation materials with your audience digitally.  No more emailing for slides.  Get your team signed up today!</p>
              <h1>Collect Feedback</h1>
              <p>Solicit ratings and commentary that enable you to constructively improve your materials.  A little bit better every day.</p>
              <h1>Engage Audiences</h1>
              <p>Engage audiences after events by offering promotions, referrals, and information about upcoming events.  Continue your continuing educational offerings with thoughtful customer engagement.</p>
          </div>
          <div className="pt-20">
              <h1>Spread Love</h1>
              <div className="shadow-lg m-5 pr-10 text-right">&quot;amazeballs&quot; &mdash; Jeff</div>
              <div className="shadow-lg m-5 pr-10 text-right">&quot;tweets cool&quot; &mdash; Yann</div>
              <div className="shadow-lg m-5 pr-10 text-right">&quot;errbody likes it&quot; &mdash;Jordan</div>
          </div>
      </div>
    </>
  )
}

export default Home
