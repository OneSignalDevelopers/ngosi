import PresentationForm from "@components/PresoForm";
import Footer from "@components/Footer";
import { presentationUrl } from "@state";
import { NextPage } from "next";
import Head from "next/head";
import QRCode from "react-qr-code";
import { useRecoilValue } from "recoil";

const Preso: NextPage = () => {
  const url = useRecoilValue(presentationUrl);

  return (
    <div className="flex flex-col min-h-screen min-w-full">
      <Head>
        <title>Ngosi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col flex-1">
        <h1 className="text-3xl bg-black py-2 px-6 text-white">
          Add Presentation
        </h1>
        <div className="flex flex-col mt-4  pt-4 px-6">
          <div className="flex justify-center">
            <QRCode value={url} />
          </div>
          <div className="mt-6">
            <PresentationForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Preso;
