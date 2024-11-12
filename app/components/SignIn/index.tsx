"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";

export default function SignIn() {
  const verifyProof = async (proof: any) => {
    throw new Error("TODO: verify proof server route");
  };

  const onSuccess = () => {
    console.log("Success");
  };

  return (
    <div>
      <IDKitWidget
        app_id="app_9897742c74de3a2709c27ce0e7d2b759"
        action="login"
        autoClose={false}
        verification_level={VerificationLevel.Device}
        handleVerify={verifyProof}
        onSuccess={onSuccess}
      >
        {({ open }) => <button onClick={open}>Verify with World ID</button>}
      </IDKitWidget>
    </div>
  );
}
