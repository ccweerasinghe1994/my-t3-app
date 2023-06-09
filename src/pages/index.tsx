import { type NextPage } from "next";
import Head from "next/head";
import { UserButton, useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { useState } from "react";
import type { FC } from "react";
import {
  LoaderSpinnerPage,
  LoaderSpinner,
} from "~/components/loader.component";
import toast from "react-hot-toast";
import Link from "next/link";
dayjs.extend(relativeTime);
type PostWithUser = RouterOutputs["post"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div
      className="flex items-center gap-3 border-b border-slate-200 p-8 "
      key={post.id}
    >
      <Image
        className="h-10 w-10 rounded-full"
        src={author.profilePicture}
        alt=""
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <div>
          <span>
            <Link href={`/@${author.username ?? ""}`}>@{author?.username}</Link>{" "}
            ·{" "}
            <Link href={`/posts/${post.id}`}>
              {dayjs(post.createdAt).fromNow()}
            </Link>
          </span>
        </div>
        <span className="text-xl">{post.content}</span>
      </div>
    </div>
  );
};

const CreatePostWizard: FC = () => {
  // user data
  const [input, setInput] = useState("");
  const { user } = useUser();
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.post.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.post.getAll.invalidate();
    },
    onError: (err) => {
      const error = err.data?.zodError?.fieldErrors?.content;
      const otherError = err.message;

      if (error && error[0]) {
        toast.error(error[0]);
        return;
      }
      if (otherError) {
        toast.error(otherError);
      }
    },
  });
  // if user is not logged in

  if (!user) {
    return null;
  }

  return (
    <div className="flex w-full gap-3 px-4 pt-4">
      <Image
        className="h-10 w-10 rounded-full"
        src={user.profileImageUrl}
        alt="profile image"
        width={56}
        height={56}
      />
      <input
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input === "") return;
            mutate({
              content: input,
            });
          }
        }}
        type="text"
        placeholder="type some emojis"
        className="grow bg-transparent outline-none"
        onChange={(e) => setInput(e.target.value)}
        value={input}
        disabled={isPosting}
      />
      {input !== "" && !isPosting && (
        <button
          disabled={isPosting}
          onClick={() => {
            mutate({
              content: input,
            });
          }}
        >
          Post
        </button>
      )}
      {isPosting && (
        <div className="flex items-center justify-center ">
          <LoaderSpinner size={20} />
        </div>
      )}
    </div>
  );
};
const Feed = () => {
  const { data, isLoading: postLoading } = api.post.getAll.useQuery();
  if (postLoading) {
    return <LoaderSpinnerPage size={30} />;
  }

  // no data return empty
  if (!data) {
    return <div>Something went wrong</div>;
  }
  return (
    <div className="flex flex-col">
      {data?.map(({ post, author }) => (
        <PostView key={post.id} post={post} author={author} />
      ))}
    </div>
  );
};
const Home: NextPage = () => {
  const { isLoaded: userLoaded } = useUser();
  api.post.getAll.useQuery();

  if (!userLoaded) return <div />;

  // no data return empty

  return (
    <>
      <Head>
        <title>Chirp</title>
        <meta name="description" content="🐥" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400  bg-opacity-30 md:max-w-2xl ">
          <CreatePostWizard />
          <Feed />
        </div>
      </main>
    </>
  );
};

export default Home;
