import {
  verifyCloudProof,
  IVerifyResponse,
  ISuccessResult,
} from "@worldcoin/minikit-js";
import { NextRequest, NextResponse } from "next/server";
import { connect, disConnect, createReputation, authUser } from "@/app/db/graphDB";

interface IRequestPayload {
  payload: ISuccessResult;
  action: string;
  signal: string | undefined;
  actionData: string | undefined;
}

// This route will always return a user's information on successful verification
export async function POST(req: NextRequest) {
  const { payload, action, signal, actionData } = (await req.json()) as IRequestPayload;
  const app_id = process.env.APP_ID as `app_${string}`;
  const verifyRes = (await verifyCloudProof(
    payload,
    app_id,
    action,
    signal
  )) as IVerifyResponse; // Wrapper on this

  console.log(verifyRes);

  if (verifyRes.success) {
    const driver = await connect();
    let res = {};
    // Create a new reputation node in the graph database
    if (action === "create") {
      const actionDataJson = actionData ? JSON.parse(actionData) : {};
      res = await createReputation(driver, actionDataJson);
    } else if (action === "login") {
      console.log(payload.nullifier_hash);
      res = await authUser(driver, { userId: payload.nullifier_hash, username: actionData });
    }

    if (res !== undefined) {
      await disConnect(driver);
      return NextResponse.json({ user: JSON.stringify(res), status: 200 });
    } else {
      await disConnect(driver);
      return NextResponse.json({ verifyRes, status: 400 });
    }
    
  } else {
    // This is where you should handle errors from the World ID /verify endpoint.
    // Usually these errors are due to a user having already verified.
    return NextResponse.json({ verifyRes, status: 400 });
  }
}
