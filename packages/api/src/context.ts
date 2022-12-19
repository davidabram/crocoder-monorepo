import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession, type Session } from "@crocoderdev/auth";
import { prisma } from "@crocoderdev/db";

type CreateContextOptions = {
  session: Session | null;
};

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (
  opts: CreateContextOptions,
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  return {
    session: opts.session,
    prisma,
    req,
    res,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  // Get the session from the server using the unstable_getServerSession wrapper function
  const session = await getServerSession({ req, res });

  return await createContextInner(
    {
      session,
    },
    req,
    res,
  );
};

export type Context = inferAsyncReturnType<typeof createContext>;
