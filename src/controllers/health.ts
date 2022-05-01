import { NextApiRequest, NextApiResponse } from "next";
import { Controller } from "../controller";

export class HealthController extends Controller {
  get(_request: NextApiRequest, res: NextApiResponse) {
    res.json({ alive: true })
  }
}
