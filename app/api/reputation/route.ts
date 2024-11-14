import { NextRequest, NextResponse } from "next/server";
import { connect, disConnect, getReputation } from "@/app/db/graphDB";

export async function POST(req: NextRequest) {
    const { userId } = await req.json();
    console.log("userId passed to getReputation: ", userId);
    const driver = await connect();
    const res = await getReputation(driver, userId);
    console.log("Reputations fetched: ", res);
    await disConnect(driver);
    
    return NextResponse.json({ reputations: JSON.stringify(res), status: 200 });
}