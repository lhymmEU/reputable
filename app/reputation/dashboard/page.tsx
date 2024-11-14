"use client";

import ReputationCard from "@/app/components/ReputationCard";
import { useUserContext } from "@/app/components/user-provider";
import { useEffect, useState } from "react";

interface Reputation {
  name: string;
  skill: string;
  description: string;
  deliverable: string;
  decayFn: string;
  decayParam: number;
}

export default function Page() {
  const { userData } = useUserContext();
  console.log("User data in Reputation Dashboard: ", userData);
  const [reputationsJson, setReputationsJson] = useState<Reputation[]>([]);
  // fetch for user's reputation
  useEffect(() => {
    const fetchReputations = async () => {
      try {
        const response = await fetch("/api/reputation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userData?.userId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch reputations");
        }

        const responseJson = await response.json();
        const reputationsJson = await JSON.parse(responseJson.reputations);
        console.log("Reputations json: ", reputationsJson);
        setReputationsJson(reputationsJson);
      } catch (error) {
        console.error("Error fetching reputations:", error);
      }
    };

    // Only call fetchReputations if userData is defined
    if (userData?.userId) {
      fetchReputations();
    }
  }, [userData?.userId]);

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Reputation Dashboard</h1>
      <ul className="space-y-4">
        {reputationsJson.map((rep: Reputation, index) => (
          <li key={index}>
            <ReputationCard
              name={rep.name}
              skill={rep.skill}
              description={rep.description}
              deliverable={rep.deliverable}
              decayFn={rep.decayFn}
              decayParam={rep.decayParam}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
