import { createCookieSessionStorage } from "react-router";
import type { UserSchemaType } from "./schemas/userSchema";


type SessionData = {
  user?: UserSchemaType;
  token?: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>(
    {
      // a Cookie from `createCookie` or the CookieOptions to create one
      cookie: {
        name: "__session",

        // all of these are optional
        // Remove domain for development - it will default to the current host
        // domain: undefined, // or set to "localhost" for development
        // Expires can also be set (although maxAge overrides it when used in combination).
        // Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
        //
        // expires: new Date(Date.now() + 60_000),
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 7 days instead of 60 seconds
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production", // Only secure in production
      },
    },
  );

export { getSession, commitSession, destroySession };
