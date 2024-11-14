"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, ChevronRight, Star } from "lucide-react";
import Decay from "../Decay";
import { Verify } from "../Verify";
import { useUserContext } from "../user-provider";

type DecayFunction = "linear" | "exponential" | "polynomial" | "hyperbolic";

export default function ReputationForm() {
  const [formData, setFormData] = useState({
    name: "",
    skill: "",
    description: "",
    deliverable: "",
    decayFn: "" as DecayFunction | "",
    decayParam: 0,
  });

  const { userData } = useUserContext();

  const [badgePreview, setBadgePreview] = useState<string | ArrayBuffer | null>(
    null
  );
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, skill: value }));
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBadgePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setFormData((prev) => ({ ...prev, badge: file }));
    }
  };

  const handleDecayFunctionChange = useCallback(
    (fn: DecayFunction | null, parameter: number) => {
      setFormData((prev) => ({
        ...prev,
        decayFn: fn || "",
        decayParam: parameter,
      }));
    },
    []
  );

  const handlePreview = () => {
    setShowPreview(true);
  };

  const ReputationCard = () => (
    <Card className="w-full max-w-sm mx-auto bg-gradient-to-br from-primary/10 to-primary/5">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
          {badgePreview ? (
            typeof badgePreview === "string" ? (
              <img
                src={badgePreview}
                alt="Badge"
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : null
          ) : (
            <Star className="w-8 h-8 text-primary" />
          )}
        </div>
        <div>
          <CardTitle className="text-xl">
            {formData.name || "Reputation Name"}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {formData.skill || "Skill Name"}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          {formData.description || "Reputation description"}
        </p>
        <div className="mt-4 text-xs text-muted-foreground">
          Decay: {formData.decayFn || "Not specified"}
          {formData.decayFn && ` (${formData.decayParam})`}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Create New Reputation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Reputation Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter reputation name"
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Reputation Category</Label>
            <Select onValueChange={handleCategoryChange}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="rust">Rust</SelectItem>
                <SelectItem value="technical-writing">
                  Technical Writing
                </SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the reputation"
              className="min-h-[100px] resize-none"
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliverable">Deliverable</Label>
            <Textarea
              id="deliverable"
              name="deliverable"
              placeholder="Describe the submission requirements"
              className="min-h-[100px] resize-none"
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Decay Function</Label>
            <Decay onFnChange={handleDecayFunctionChange} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" onClick={handlePreview}>
            Preview <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
          {showPreview && (
            <div className="space-y-4 w-full">
              <ReputationCard />
              <Verify
                actionName="create"
                destination="/reputation/dashboard"
                btnName="Create Reputation"
                actionData={JSON.stringify({ creator: userData?.userId, ...formData })}
              />
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
