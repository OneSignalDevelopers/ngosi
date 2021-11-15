import EventHeader from "@components/EventHeader";
import FatalError from "@components/FatalError";
import Footer from "@components/Footer";
import PresentationInfo from "@components/PresentationInfo";
import SurveyForm from "@components/SurveyForm";
import { Preso, Presenter } from "@types";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const presenter: Presenter = {
  id: "1",
  firstName: "Yohanan",
  lastName: "Negash",
  email: "yoh.negash@yahoo.com",
  profileImage: "",
  presentations: [],
};

const presentation: Preso = {
  id: "SEXY",
  eventName: "React Conf",
  presenter: presenter.id,
  title: "How to do stuff in React",
  location: "London",
};

const presenterDb = new Map<string, Presenter>();
const presentationDb = new Map<string, Preso>();

presenterDb.set(presenter.id, presenter);
presentationDb.set(presentation.id, presentation);

const getPresentation = (id: string) => presentationDb.get(id);
const getPresenter = (id: string) => presenterDb.get(id);

const title =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.";

const Survey: NextPage = () => {
  const router = useRouter();
  const { pid } = router.query;

  console.log("PID", pid);
  if (!pid || typeof pid !== "string") {
    return <FatalError message="An error occured." />;
  }

  const presention = getPresentation(pid);
  if (!presention) {
    return <FatalError message="Presentation doesn't exist" />;
  }
  const presenter = getPresenter(presentation.presenter);
  if (!presenter) {
    return (
      <FatalError message="Presenter could not be found. This is a big problem." />
    );
  }
  const { firstName, lastName } = presenter;

  return (
    <div className="flex flex-col min-h-screen min-w-full">
      <Head>
        <title>Ngosi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <EventHeader name="React Conf" location="London" />

      <main className="flex flex-col flex-1 mt-2 space-y-3">
        <div className="px-8 py-2">
          <PresentationInfo
            firstName={firstName}
            lastName={lastName}
            title={title}
          />
        </div>
        <div className="w-full bg-gray-50">
          <div className="px-8 py-3">
            <SurveyForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Survey;
