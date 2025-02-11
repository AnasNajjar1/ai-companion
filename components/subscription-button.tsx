"use client";

import axios from "axios";
import { useState } from "react";
import { Sparkle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface SubscriptionButtonProps {
  isPro: boolean;
}

export const SubscriptionButton = ({
  isPro = false,
}: SubscriptionButtonProps) => {

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const onClick = async () => {
    try {
        setLoading(true);

        const response = await axios.get("/api/stripe");

        window.location.href = response.data.url;
    } catch (error) {
        toast({
            variant: "destructive",
            description: "Something went wrong"
        })
    } finally {
        setLoading(false);
    }
  }  

  return (
    <Button onClick={onClick} disabled={loading} size="sm" variant={isPro ? "default" : "premium"}>
      {isPro ? "Manage subscription" : "Upgrade"}
      {!isPro && <Sparkle className="h-4 w-4 ml-2 fill-white" />}
    </Button>
  );
};
