import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownRight } from "lucide-react";

interface ReputationCardProps {
  name: string;
  skill: string;
  description: string;
  deliverable: string;
  decayFn: string;
  decayParam: number;
}

export default function ReputationCard(cardInfo: ReputationCardProps) {
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
          <div>
            <h3 className="text-sm font-semibold">Deliverable</h3>
            <p className="text-sm text-muted-foreground">
              {cardInfo.deliverable}
            </p>
          </div>
          <div className="text-right">
            <h3 className="text-sm font-semibold">Decay Function</h3>
            <p className="text-sm text-muted-foreground">{cardInfo.decayFn}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <ArrowDownRight className="text-destructive" />
          <span className="font-medium text-destructive">
            Decay Rate: {cardInfo.decayParam}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
