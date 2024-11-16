"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownRight } from "lucide-react";
import { useState } from "react";
import { useUserContext } from "../user-provider";
import { useRouter } from "next/navigation";
import { Verify } from "../Verify";

interface ReputationCardProps {
  name: string;
  skill: string;
  description: string;
  deliverable: string;
  decayFn: string;
  decayParam: number;
}

export default function ReputationCard(cardInfo: ReputationCardProps) {
  const [inputValue, setInputValue] = useState("");
  const { userData } = useUserContext();
  const router = useRouter();

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  }

  return (
    <Card className="w-full max-w-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary to-primary-foreground p-6">
        <CardTitle className="text-2xl font-bold text-white">
          {cardInfo.name}
        </CardTitle>
        <Badge variant="secondary" className="mt-2">
          {cardInfo.skill}
        </Badge>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <p className="text-sm text-muted-foreground">{cardInfo.description}</p>
        <div className="flex items-center justify-between">
          <div className="text-right">
            <h3 className="text-sm font-semibold">Decay Function</h3>
            <p className="text-sm text-muted-foreground">{cardInfo.decayFn}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Deliverable</h3>
            <p className="text-sm text-muted-foreground">
              {cardInfo.deliverable}
            </p>
            <input type="text" placeholder="Submit link here..." value={inputValue} onChange={handleInputChange} />
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex space-x-2">
            <ArrowDownRight className="text-destructive" />
            <span className="font-medium text-destructive">
              Decay Rate: {cardInfo.decayParam}
            </span>
          </div>
          <Verify actionName="claim" destination="/reputation/dashboard" btnName="Claim" actionData={JSON.stringify({ userId: userData?.userId, repName: cardInfo.name, link: inputValue })} />
        </div>
      </CardContent>
    </Card>
  );
}
