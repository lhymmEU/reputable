import { connect, disConnect, claimRep } from "@/app/db/graphDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const info = await req.json();
    const driver = await connect();
    const res = await claimRep(driver, info);
    await disConnect(driver);
    return NextResponse.json({ message: res });
  } catch (err) {
    return NextResponse.json({ error: "Claim failed" }, { status: 500 });
  }
}
