import type { User } from "@clerk/nextjs/dist/server";
export const filterUser = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profilePicture: user.profileImageUrl,
    name: user.firstName,
    email: user.emailAddresses[0],
  };
};
