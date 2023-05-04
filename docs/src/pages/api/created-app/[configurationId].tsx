import cookie from "cookie";
import { randomBytes } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { getCookieData } from "../../../cookie-data";

const ghAppSchema = z.object({
  slug: z.string(),
  client_id: z.string(),
  client_secret: z.string(),
});

const domainsSchema = z.object({
  domains: z
    .array(
      z.object({
        name: z.string(),
      })
    )
    .min(1),
});

const projectSchema = z.object({
  link: z.object({
    type: z.literal("github"),
    org: z.string(),
    repo: z.string(),
  }),
});

export default async function resolver(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (
    typeof req.query.code !== "string" ||
    !/^[a-zA-Z0-9]+$/.test(req.query.code)
  ) {
    res.status(400).send("Bad Request");
    return;
  }
  const cookieData = await getCookieData(
    req,
    req.query.configurationId as string
  );
  const [project, ghAppRes, vercelDomainsRes] = await Promise.all([
    fetch(
      `https://api.vercel.com/v9/projects/${cookieData.projectId}${
        cookieData.teamId ? `?teamId=${cookieData.teamId}` : ""
      }`,
      {
        headers: {
          Authorization: `Bearer ${cookieData.accessToken}`,
        },
      }
    )
      .then((x) => x.json())
      .then(async (project) => {
        const parsedProject = projectSchema.safeParse(project);
        if (!parsedProject.success) {
          throw new Error(
            `unexpected project response:\n${JSON.stringify(project, null, 2)}`
          );
        }
        return parsedProject.data;
      }),
    fetch(
      `https://api.github.com/app-manifests/${req.query.code}/conversions`,
      { method: "POST", headers: { Accept: "application/json" } }
    ),
    fetch(
      `https://api.vercel.com/v9/projects/${
        cookieData.projectId
      }/domains?production=true${
        cookieData.teamId ? `&teamId=${cookieData.teamId}` : ""
      }`,
      { headers: { Authorization: `Bearer ${cookieData.accessToken}` } }
    ),
  ]);

  if (!ghAppRes.ok) {
    console.log(ghAppRes);
    res.status(500).send("An error occurred while creating the GitHub App");
    return;
  }
  if (!vercelDomainsRes.ok) {
    console.log(vercelDomainsRes);
    res.status(500).send("An error occurred while fetching production domain");
    return;
  }

  const [ghAppDataRaw, vercelDomainsRaw] = await Promise.all([
    ghAppRes.json(),
    vercelDomainsRes.json(),
  ]);

  const ghAppDataResult = ghAppSchema.safeParse(ghAppDataRaw);
  const vercelDomainsResult = domainsSchema.safeParse(vercelDomainsRaw);

  if (!ghAppDataResult.success) {
    console.log(ghAppDataRaw);
    res.status(500).send("An unexpected response was received from GitHub");
    return;
  }
  if (!vercelDomainsResult.success) {
    console.log(vercelDomainsResult);
    res.status(500).send("An unexpected response was received from Verel");
    return;
  }

  const { org, repo } = project.link;
  const airtableRes = await fetch(
    `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID}/${process.env.AIRTABLE_REPO_TABLE_ID}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          owner: org,
          name: repo,
          domain: vercelDomainsResult.data.domains[0].name,
        },
      }),
    }
  );
  if (!airtableRes.ok) {
    console.log("failed to log repo to airtable");
    console.error(airtableRes);
    throw new Error(
      `failed to log repo to airtable ${airtableRes.status}:\n` +
        (await airtableRes.text())
    );
  }

  const envUpdatingRes = await fetch(
    `https://api.vercel.com/v10/projects/${cookieData.projectId}/env${
      cookieData.teamId ? `?teamId=${cookieData.teamId}` : ``
    }`,
    {
      headers: {
        Authorization: `Bearer ${cookieData.accessToken}`,
      },
      method: "post",
      body: JSON.stringify([
        {
          type: "encrypted",
          key: "KEYSTATIC_GITHUB_CLIENT_ID",
          value: ghAppDataResult.data.client_id,
          target: ["development", "production", "preview"],
        },
        {
          type: "encrypted",
          key: "KEYSTATIC_GITHUB_CLIENT_SECRET",
          value: ghAppDataResult.data.client_secret,
          target: ["development", "production", "preview"],
        },
        {
          type: "encrypted",
          key: "KEYSTATIC_SECRET",
          value: randomBytes(40).toString("hex"),
          target: ["development", "production", "preview"],
        },
        {
          type: "plain",
          key: "NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG",
          value: ghAppDataResult.data.slug,
          target: ["development", "production", "preview"],
        },
        {
          type: "plain",
          key: "KEYSTATIC_URL",
          value: `https://${vercelDomainsResult.data.domains[0].name}`,
          target: ["production", "preview"],
        },
      ]),
    }
  );
  if (!envUpdatingRes.ok) {
    console.error(envUpdatingRes);
    console.error(await envUpdatingRes.text());
    res
      .status(500)
      .send("An error occurred while updating environment variables");
    return;
  }
  res.setHeader(
    "Set-Cookie",
    cookie.serialize(`ks-${req.query.configurationId}`, "", {
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      expires: new Date(),
      maxAge: 0,
    })
  );
  res.redirect(cookieData.next);
}
