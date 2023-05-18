import { UserButton } from "@clerk/nextjs";
import type { NextPage } from "next";
import Head from "next/head";

const SinglePostPage: NextPage = () => {
  // no data return empty

  return (
    <>
      <Head>
        <title>Posts</title>
        <meta name="description" content="🐥" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div>Post</div>
      </main>
    </>
  );
};

export default SinglePostPage;
