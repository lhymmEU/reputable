"use client";

import { useState, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

type DecayFunction = "linear" | "exponential" | "polynomial" | "hyperbolic";

interface DecayProps {
  onFnChange: (
    selectedFunction: DecayFunction | null,
    parameter: number
  ) => void;
}

export default memo(function Decay({ onFnChange }: DecayProps) {
  const [selectedFunction, setSelectedFunction] =
    useState<DecayFunction | null>(null);
  const [parameter, setParameter] = useState(1);

  const decayFunctions: Record<DecayFunction, (x: number) => number> = {
    linear: (x) => 1 - parameter * x,
    exponential: (x) => Math.exp(-parameter * x),
    polynomial: (x) => 1 / (1 + parameter * Math.pow(x, 2)),
    hyperbolic: (x) => 1 / (1 + parameter * x),
  };

  const applyChanges = useCallback(() => {
    onFnChange(selectedFunction, parameter);
  }, [selectedFunction, parameter, onFnChange]);


  const renderGraph = () => {
    if (!selectedFunction) return null;

    const points = [];
    const fn = decayFunctions[selectedFunction];
    for (let x = 0; x <= 1; x += 0.05) {
      points.push(`${x * 100},${100 - fn(x) * 100}`);
    }

    return (
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polyline
          points={points.join(" ")}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    );
  };

  return (
    <>
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(["linear", "exponential", "polynomial", "hyperbolic"] as const).map(
          (fn) => (
            <Button
              key={fn}
              variant={selectedFunction === fn ? "default" : "outline"}
              onClick={() => setSelectedFunction(fn as DecayFunction)}
            >
              {fn.charAt(0).toUpperCase() + fn.slice(1)}
            </Button>
          )
        )}
      </div>
      {selectedFunction && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Parameter</Label>
            <Slider
              min={0.1}
              max={5}
              step={0.1}
              value={[parameter]}
              onValueChange={(value) => setParameter(value[0])} // Updated to capture slider value
            />
            <div className="text-sm text-center">
              Value: {parameter.toFixed(1)}
            </div>
          </div>
          <div className="h-32 bg-muted rounded-md overflow-hidden">
            {renderGraph()}
          </div>
          <Button className="w-full" onClick={applyChanges}>
            Apply Decay Function
          </Button>
        </div>
      )}
    </div>
    </>
  );
});
