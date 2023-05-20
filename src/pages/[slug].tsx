import type { NextPage } from "next";
import Head from "next/head";
import { LoaderSpinnerPage } from "~/components/loader.component";
import { api } from "~/utils/api";

const ProfilePage: NextPage = () => {
  const { data, isLoading } = api.profile.getUserByUserName.useQuery({
    emailAddress: "ccweerasinghe1994@gmail.com",
  });

  if (isLoading) {
    return <LoaderSpinnerPage size={30} />;
  }

  if (!data) {
    return <div>Something went wrong</div>;
  }
  console.log(data);

  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="description" content="🐥" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center gap-4 ">
        <div>
          <span>Name: </span>
          {data.name}
        </div>

        <div>
          <span>Id: </span>
          {data.id}
        </div>
        <div>
          <span>Email: </span>
          {data.email?.emailAddress}
        </div>
      </main>
    </>
  );
};

export default ProfilePage;
