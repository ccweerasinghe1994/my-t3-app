import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { filterUser } from "~/server/helpers/filterUserForTheClient";

export const profileRouter = createTRPCRouter({
  getUserByUserName: publicProcedure
    .input(
      z.object({
        emailAddress: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const [user] = await clerkClient.users.getUserList({
        emailAddress: [input.emailAddress],
      });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }

      return filterUser(user);
    }),
});
