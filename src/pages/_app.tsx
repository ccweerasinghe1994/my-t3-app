import { type AppType } from "next/app";
import { ClerkProvider, UserButton } from "@clerk/nextjs";
import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";
import Link from "next/link";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Toaster position="bottom-center" />
      <header className="flex justify-between bg-gray-100 py-3 pr-5  dark:bg-gray-800">
        <Link href="/">
          <span className="pl-5 text-lg font-semibold text-white">Chirp</span>
        </Link>
        <UserButton />
      </header>
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
