import fs from "fs";
import mime from "mime-types";
import { type NextApiRequest, type NextApiResponse } from "next";
import path from "path";
import { env } from "~/env.mjs";

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
  const imageFile = req.query.filename
  if(typeof imageFile !== "string") {
    res.status(400).send({ error: "Missing filename" });
    return
  }
  const filePath = path.resolve(env.IMAGE_UPLOAD_DIR, imageFile);
  const imageBuffer = fs.readFileSync(filePath);
  res.setHeader("Content-Type", mime.lookup(imageFile) || 'image/png');
  return res.send(imageBuffer);
}