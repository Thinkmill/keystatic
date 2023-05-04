import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.query["deployment-url"]) {
    return res.status(400).send("Bad Request");
  }
  res.redirect(
    `${req.query["deployment-url"]}/api/keystatic/from-template-deploy`
  );
}
