"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toWhatsAppLink } from "@/lib/utils/format";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { getListingContact } from "@/lib/api/listings";

interface ContactOwnerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listingId: string;
  listingTitle: string;
  isAuthenticated: boolean;
}

export function ContactOwnerModal({
  open,
  onOpenChange,
  listingId,
  listingTitle,
  isAuthenticated,
}: ContactOwnerModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const whatsappMessage = `Bhalobasha তে আপনার বাসাটি দেখলাম — ${listingTitle}`;

  async function messageOnWhatsApp() {
    const whatsappWindow = window.open("", "_blank");
    if (whatsappWindow) {
      whatsappWindow.opener = null;
    }
    setIsLoading(true);
    try {
      const { contactPhone } = await getListingContact(listingId);
      const whatsappUrl = toWhatsAppLink(contactPhone, whatsappMessage);
      if (whatsappWindow) {
        whatsappWindow.location.href = whatsappUrl;
      } else {
        window.location.assign(whatsappUrl);
      }
    } catch (error) {
      whatsappWindow?.close();
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        onOpenChange(false);
        router.push("/dashboard/subscription");
        return;
      }
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        router.push(`/login?redirect=/listings/${listingId}`);
        return;
      }
      toast.error("Could not retrieve the owner's contact details");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact Owner</DialogTitle>
        </DialogHeader>
        {isAuthenticated ? (
          <div className="space-y-4">
            <p className="text-sm text-muted">
              An active subscription is required to contact the owner.
            </p>
            <Button
              className="w-full"
              size="lg"
              onClick={messageOnWhatsApp}
              disabled={isLoading}
            >
              <MessageCircle className="h-5 w-5" />
              {isLoading ? "Checking subscription…" : "Message on WhatsApp"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <p className="text-muted">
              Login to see the owner&apos;s contact number and WhatsApp link.
            </p>
            <Button asChild className="w-full">
              <Link href="/login">Login to see contact</Link>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
