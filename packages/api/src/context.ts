import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { UserSession, AdminSession } from "@ecotoken/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAdminSession, getUserSession } from "@ecotoken/auth";

import { prisma } from "@ecotoken/db";

/**
 * Replace this with an object if you want to pass things to createContextInner
 */
type CreateContextOptions = {
	userSession: UserSession;
    adminSession: AdminSession;
	req: NextApiRequest;
	res: NextApiResponse;
};

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://beta.create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
	return {
		prisma,
		...opts
	};
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async ({ req, res }: CreateNextContextOptions) => {
	// fetch the session, decrypt cookie/deserialize -> createContextInner as `userSession` and `adminSession` (optional fields)
    const userSession = await getUserSession(req, res);
    const adminSession = await getAdminSession(req, res);
	return await createContextInner({
		userSession,
        adminSession,
		req,
		res
	});
};

export type Context = inferAsyncReturnType<typeof createContext>;
