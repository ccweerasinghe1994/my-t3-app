import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data } = api.post.getAll.useQuery();

  return (
    <>
      <Head>
        <title>chirp</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="flex justify-between bg-gray-100 py-3 pr-5  dark:bg-gray-800">
        <span className="pl-5 text-lg font-semibold text-white">Chirp</span>
        <UserButton />
      </header>
      <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div>
          {data?.map((post) => (
            <div className="p-5 text-slate-300" key={post.id}>
              🪲 {post.content}
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Home;
