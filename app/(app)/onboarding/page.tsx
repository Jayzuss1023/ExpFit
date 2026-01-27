"use client";

import {
  ArrowRightIcon,
  Check,
  Dumbbell,
  Loader2Icon,
  MapPinIcon,
  TargetIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AddressSearch } from "@/components/app/maps/AddressSearch";
import { RadiusSelector } from "@/components/app/maps/RadiusSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { completeOnboarding } from "@/lib/actions/profile";

type Step = "location" | "radius";

interface LocationData {
  lat: number;
  lng: number;
  address: string;
}

export default function OnboardingPage() {
  const Router = useRouter();
  const [step, setStep] = useState<Step>("location");
  const [location, setLocation] = useState<LocationData | null>(null);
  const [radius, setRadius] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (step === "location" && location) {
      setStep("radius");
    }
  };

  const handleBack = () => {
    if (step === "radius") {
      setStep("location");
    }
  };

  const handleComplete = async () => {
    if (!location || !radius) return;

    setIsSubmitting(true);
    setError(null);

    const result = await completeOnboarding({
      location,
      searchRadius: radius,
    });

    if (result.success) {
      // Force full page reload to refresh Clerk user metadata cache
      window.location.href = "/";
    } else {
      setError(result.error || "Something went wrong");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center px-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">FitPass</span>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Profress indicator */}
          <div className=" mb-8 flex items-center justify-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                step === "location"
                  ? "bg-primary text-primary-forground shadow-lg shadow-primary/30"
                  : "bg-primary/20 text-primary"
              }`}
            >
              {step === "radius" ? <Check className="h-5 w-5" /> : "1"}
            </div>
            <div
              className={`h-1 w-12 rounded-full transition-all ${
                step === "radius" ? "bg-primary" : "bg-border"
              }`}
            />
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                step === "radius"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </div>
          </div>

          {/* Step content */}
          <Card className="shadow-xl border-primary/10">
            <CardContent className="p-6">
              {step === "location" && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="mx-auto bg-primary/10 mb-4 flex h-14 w-14 items-center justify-center rounded-2xl">
                      <MapPinIcon className="h-7 w-7 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">
                      Where are you located?
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                      We'll show you classes near your location
                    </p>
                  </div>

                  <AddressSearch
                    value={location}
                    onChange={setLocation}
                    placeholder="Search for your city or address..."
                  />

                  <Button
                    onClick={handleNext}
                    disabled={!location}
                    className="w-full h-12 text-base rounded-xl"
                  >
                    Continue
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}

              {step === "radius" && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="flex mx-auto h-14 w-14 mb-4 items-center justify-center rounded-2xl bg-primary/10">
                      <TargetIcon className="h-7 w-7 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">
                      How far will you travel?
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                      Set your maximum distance for classes
                    </p>
                  </div>

                  <RadiusSelector value={radius} onChange={setRadius} />

                  {error && (
                    <p className="text-center text-sm text-destructive">
                      {error}
                    </p>
                  )}

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="flex-1 h-12 text-base rounded-xl"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleComplete}
                      disabled={!radius || isSubmitting}
                      className="flex-1 h-12 text-base rounded-xl"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Get Started"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          {/* Skip option for testing */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            You can update these preferences anytime in your profile
          </p>
        </div>
      </main>
    </div>
  );
}
