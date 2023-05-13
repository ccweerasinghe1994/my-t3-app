import { type NextPage } from "next";
import Head from "next/head";
import { UserButton, useUser } from "@clerk/nextjs";
import { RouterOutputs, api } from "~/utils/api";

type PostWithUser = RouterOutputs["post"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div
      className="flex items-center gap-3 border-b border-slate-200 p-8 "
      key={post.id}
    >
      <img
        className="h-14 w-14 rounded-full"
        src={author.profilePicture}
        alt=""
      />
      <div className="flex flex-col">
        <div>
          <span>@{author.username}</span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  );
};

const CreatePostWizard = () => {
  // user data

  const { user } = useUser();

  // if user is not logged in
  if (!user) {
    return null;
  }

  return (
    <div className="flex w-full gap-3 ">
      <img
        className="h-14 w-14 rounded-full"
        src={user.profileImageUrl}
        alt="profile image"
      />
      <input
        type="text"
        placeholder="type some emojis"
        className="grow bg-transparent outline-none"
      />
    </div>
  );
};

const Home: NextPage = () => {
  const { data, isLoading } = api.post.getAll.useQuery();

  if (isLoading) {
    return <div className="animate-spin">Loading...</div>;
  }

  // no data return empty
  if (!data) {
    return <div>No data</div>;
  }

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
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400  bg-opacity-30 md:max-w-2xl ">
          <CreatePostWizard />
          <div className="flex flex-col">
            {data?.map(({ post, author }) => (
              <PostView key={post.id} post={post} author={author} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
