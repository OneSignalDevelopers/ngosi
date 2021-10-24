import type { NextPage } from "next";
import Head from "next/head";
import AttendeeForm from "../components/AttendeeForm";
import EventHeader from "../components/EventHeader";
import Footer from "../components/Footer";
import PresentationInfo from "../components/PresentationInfo";

const title =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col min-h-screen min-w-full">
      <Head>
        <title>Ngosi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <EventHeader name="React Conf" location="London" />

      <main className="flex flex-col flex-1 mt-2 space-y-3">
        <div className="px-8 py-2">
          <PresentationInfo firstName="Leo" lastName="dvorak" title={title} />
        </div>
        <div className="w-full bg-gray-50">
          <div className="px-8 py-3">
            <AttendeeForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
