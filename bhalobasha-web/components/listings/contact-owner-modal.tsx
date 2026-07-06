"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatPhone, toWhatsAppLink } from "@/lib/utils/format";
import { Phone, MessageCircle } from "lucide-react";
import Link from "next/link";

interface ContactOwnerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactPhone: string;
  listingTitle: string;
  isAuthenticated: boolean;
}

export function ContactOwnerModal({
  open,
  onOpenChange,
  contactPhone,
  listingTitle,
  isAuthenticated,
}: ContactOwnerModalProps) {
  const whatsappMessage = `Bhalobasha তে আপনার বাসাটি দেখলাম — ${listingTitle}`;
  const whatsappUrl = toWhatsAppLink(contactPhone, whatsappMessage);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact Owner</DialogTitle>
        </DialogHeader>
        {isAuthenticated ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg bg-primary-light p-4">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted">Phone Number</p>
                <p className="text-lg font-semibold">{formatPhone(contactPhone)}</p>
              </div>
            </div>
            <Button asChild className="w-full" size="lg">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" />
                Message on WhatsApp
              </a>
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
