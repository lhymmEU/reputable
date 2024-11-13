"use client";

import { useState } from "react";
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
import { Upload, ChevronRight } from "lucide-react";

export default function ReputationForm() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    badge: null,
    description: "",
  });
  const [badgePreview, setBadgePreview] = useState<string | ArrayBuffer | null>(
    null
  );

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
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

  const handlePreview = () => {
    console.log("Preview:", formData);
    // Implement preview logic here
  };

  return (
    <Card className="w-full max-w-md mx-auto">
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
          <Label htmlFor="badge">Badge Icon</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="badge"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {!badgePreview && <Button asChild variant="outline" className="w-full">
              <label
                htmlFor="badge"
                className="cursor-pointer flex items-center justify-center"
              >
                <Upload className="mr-2 h-4 w-4" /> Upload Icon
              </label>
            </Button>}
            {badgePreview && (
              <div className="w-10 h-10 overflow-hidden">
                {typeof badgePreview === "string" && (
                  <img
                    src={badgePreview}
                    alt="Badge preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            )}
          </div>
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
          <Label>Decay Function</Label>
          <div className="h-24 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
            Decay Function Placeholder
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handlePreview}>
          Preview <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
