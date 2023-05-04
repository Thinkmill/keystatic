import Iron from "@hapi/iron";
import { z } from "zod";
import { IncomingMessage } from "http";

const paramsSchema = z.object({
  t: z.string(),
  i: z.string(),
  p: z.string(),
  u: z.string(),
  e: z.string().optional(),
  n: z.string(),
});

export async function getCookieData(
  req: IncomingMessage & {
    cookies: Partial<{
      [key: string]: string;
    }>;
  },
  configurationId: string
) {
  const cookieData = req.cookies[`ks-${configurationId}`];
  if (!cookieData) {
    throw new Error("Cookie not found");
  }

  const unsealedData = await Iron.unseal(
    cookieData,
    process.env.SESSION_SECRET!,
    Iron.defaults
  );
  if (typeof unsealedData !== "string") {
    throw new Error("Cookie data is not a string");
  }
  const _parsedParams = Object.fromEntries([
    ...new URLSearchParams(unsealedData),
  ]);
  const parsed = paramsSchema.parse(_parsedParams);
  return {
    accessToken: parsed.t,
    installationId: parsed.i,
    projectId: parsed.p,
    userId: parsed.u,
    teamId: parsed.e,
    next: parsed.n,
  };
}
