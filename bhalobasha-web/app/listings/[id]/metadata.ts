import { getListingServer } from "@/lib/api/listings";
import {
  LISTING_TYPE_LABELS,
  TENANT_POLICY_LABELS,
} from "@/lib/utils/constants";
import { formatBDT } from "@/lib/utils/format";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const listing = await getListingServer(params.id);

    const primaryPhoto =
      listing.photos.find((p) => p.isPrimary) || listing.photos[0];

    const title = `${listing.title} — ${formatBDT(listing.rent)}/month | Bhalobasha`;
    const description = `${LISTING_TYPE_LABELS[listing.type].split(" / ")[0]} · ${TENANT_POLICY_LABELS[listing.tenantPolicy].split(" / ")[0]} · ${listing.area.name}, ${listing.area.thana.name}, Dhaka. ${listing.description.slice(0, 120)}...`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        url: `${BASE_URL}/listings/${listing.id}`,
        siteName: "Bhalobasha ভালোবাসা",
        images: primaryPhoto
          ? [
              {
                url: primaryPhoto.url,
                width: 1200,
                height: 630,
                alt: listing.title,
              },
            ]
          : [
              {
                url: `${BASE_URL}/og-default.webp`,
                width: 1200,
                height: 630,
                alt: "Bhalobasha — Find Your Home in Bangladesh",
              },
            ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: primaryPhoto ? [primaryPhoto.url] : [],
      },
    };
  } catch {
    // Listing not found — return default metadata
    return {
      title: "Listing | Bhalobasha",
      description:
        "Find flats, rooms, sublets and bachelor seats in Bangladesh.",
    };
  }
}
