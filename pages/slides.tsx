import type { NextPage } from "next";
import Head from "next/head";
import Footer from "../components/Footer";
import SlideUrlForm from "../components/SlideUrlForm";

const Slides: NextPage = () => {
  return (
    <div className="flex flex-col min-h-screen min-w-full">
      <Head>
        <title>Ngosi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col flex-1 mt-2 space-y-3">
        <SlideUrlForm />
      </main>
      <Footer />
    </div>
  );
};

export default Slides;
