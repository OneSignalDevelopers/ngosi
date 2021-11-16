import Footer from "@components/Footer";
import { NextPage } from "next";
import Head from "next/head";
import QRCode from "react-qr-code";
import { useRouter } from "next/router";
import { PublicUrl } from "common/constants";

const downloadQRCode = (e: React.MouseEvent) => {
  console.log("downloadQRCode clicked.");
};

const Qr: NextPage = () => {
  const router = useRouter();

  const { preso } = router.query;
  if (!preso || typeof preso !== "string") {
    return <div>Preso ID is missing</div>;
  }

  return (
    <div className="flex flex-col min-h-screen min-w-full">
      <Head>
        <title>Ngosi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col flex-1">
        <QRCode value={`${PublicUrl}/survey/${preso}`} />
        <button
          className="w-full h-14 bg-black text-white font-bold text-xl mt-5"
          type="button"
          onClick={downloadQRCode}
        >
          Download QR
        </button>
      </main>
      <Footer />
    </div>
  );
};

export default Qr;
