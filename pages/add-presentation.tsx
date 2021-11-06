import type { NextPage } from "next";
import Head from "next/head";
import QRCode from "react-qr-code";
import { useRecoilValue } from "recoil";
import AddPresentationForm from "../components/AddPresentationForm/AddPresentationForm";
import { presentationUrl } from "../components/AddPresentationForm/state";
import Footer from "../components/Footer";

const AddPresentation: NextPage = () => {
  const url = useRecoilValue(presentationUrl);

  return (
    <div className="flex flex-col min-h-screen min-w-full">
      <Head>
        <title>Ngosi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col flex-1 mt-2 space-y-3">
        <AddPresentationForm />
        <QRCode value={url} />
      </main>
      <Footer />
    </div>
  );
};

export default AddPresentation;
