import Footer from "@components/Footer";
import { NextPage } from "next";
import Head from "next/head";
import QRCode from "react-qr-code";
import { useRouter } from "next/router";

const Qr: NextPage = () => {
  const router = useRouter();

  const { url } = router.query;
  if (!url || typeof url !== "string") {
    return <div>URL is missing</div>;
  }

  return (
    <div className="flex flex-col min-h-screen min-w-full">
      <Head>
        <title>Ngosi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col flex-1">
        <QRCode value={url} />
        <button type="button">Download QR</button>
      </main>
      <Footer />
    </div>
  );
};

export default Qr;
