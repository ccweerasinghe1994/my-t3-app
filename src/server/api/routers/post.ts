import { clerkClient } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/dist/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
const filterUser = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profilePicture: user.profileImageUrl,
    name: user.firstName,
  };
};
export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });

    const users = (
      await clerkClient.users.getUserList({
        userId: posts.map((post) => post.authorId),
      })
    ).map(filterUser);

    return posts.map((post) => {
      const author = users.find((user) => user.id === post.authorId);

      if (!author) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Author not found",
        });
      }

      return {
        post,
        author: {
          id: author.id,
          username: author.username ? author.username : author.name,
          profilePicture: author.profilePicture,
        },
      };
    });
  }),

  create: privateProcedure
    .input(
      z.object({
        content: z.string().emoji().min(1).max(1000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const post = await ctx.prisma.post.create({
        data: {
          content: input.content,
          authorId,
        },
      });

      return post;
    }),
});

// user_2PueiPrz6FAhg0KhahFXUsHqIb3
