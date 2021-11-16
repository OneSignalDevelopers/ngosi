import Footer from "@components/Footer";
import { NextPage } from "next";
import Head from "next/head";
import QRCode from "react-qr-code";

const Qr: NextPage = () => {
  return (
    <div className="flex flex-col min-h-screen min-w-full">
      <Head>
        <title>Ngosi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col flex-1">
        <QRCode value="https:google.com" />
      </main>
      <Footer />
    </div>
  );
};

export default Qr;
