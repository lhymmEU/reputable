"use client";
import {
  MiniKit,
  ResponseEvent,
  VerificationLevel,
  MiniAppVerifyActionPayload,
  ISuccessResult,
} from "@worldcoin/minikit-js";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "../user-provider";

export type VerifyCommandInput = {
  action: string;
  signal?: string;
  verification_level?: VerificationLevel; // Default: Orb
};

export const Verify = ({
  actionName,
  destination,
  btnName,
  actionData,
}: {
  actionName: string;
  destination: string;
  btnName: string;
  actionData?: string;
}) => {
  const verifyPayload: VerifyCommandInput = {
    action: actionName, // This is your action ID from the Developer Portal
    signal: "",
    verification_level: VerificationLevel.Device, // Orb | Device
  };

  const { setUserData } = useUserContext();

  const triggerVerify = () => {
    MiniKit.commands.verify(verifyPayload);
  };
  const router = useRouter();

  useEffect(() => {
    if (!MiniKit.isInstalled()) {
      return;
    }

    MiniKit.subscribe(
      ResponseEvent.MiniAppVerifyAction,
      async (response: MiniAppVerifyActionPayload) => {
        if (response.status === "error") {
          return console.log("Error payload", response);
        }

        let constructedBody = "";

        // Construct different payloads based on the action
        if (actionName === "login") {
          constructedBody = JSON.stringify({
            // User identifier - nullifier - is included in the payload
            payload: response as ISuccessResult, // Parses only the fields we need to verify
            action: verifyPayload.action,
            signal: verifyPayload.signal, // Optional
            actionData: actionData, // Username
          });
        } else if (actionName === "create") {
          constructedBody = JSON.stringify({
            // User identifier - nullifier - is included in the payload
            payload: response as ISuccessResult, // Parses only the fields we need to verify
            action: verifyPayload.action,
            signal: verifyPayload.signal, // Optional
            actionData: actionData, // The newly created reputation data
          });
        }

        // Verify the proof in the backend
        const verifyResponse = await fetch("/api/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: constructedBody,
        });

        // TODO: Handle Success!
        const verifyResponseJson = await verifyResponse.json();
        if (verifyResponseJson.status === 200) {
          console.log("User verified successfully", verifyResponseJson);
          setUserData(verifyResponseJson);
          router.push(destination);
        }
      }
    );

    return () => {
      MiniKit.unsubscribe(ResponseEvent.MiniAppVerifyAction);
    };
  }, []);

  return (
    <Button
      size="lg"
      className="px-8 py-2 bg-black hover:bg-gray-700 text-white font-semibold rounded-full transition-colors duration-300"
      onClick={triggerVerify}
    >
      {btnName}
    </Button>
  );
};
