import type { NextPage } from "next";
import Head from "next/head";
import Footer from "../components/Footer";
import SlideUrlForm from "../components/SlideUrlForm";
import QRCode from "react-qr-code";

const qrCodeLink = "https://google.com";

const AddPresentation: NextPage = () => {
  return (
    <div className="flex flex-col min-h-screen min-w-full">
      <Head>
        <title>Ngosi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col flex-1 mt-2 space-y-3">
        <SlideUrlForm />
        <QRCode value={qrCodeLink} />
      </main>
      <Footer />
    </div>
  );
};

export default AddPresentation;
