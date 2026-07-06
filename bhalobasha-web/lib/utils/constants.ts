import {
  GenderPreference,
  ListingStatus,
  ListingType,
  TenantPolicy,
} from "@/types";

export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
  [ListingType.FULL_FLAT]: "পুরো ফ্ল্যাট / Full Flat",
  [ListingType.SINGLE_ROOM]: "একক রুম / Single Room",
  [ListingType.SHARED_SEAT]: "শেয়ার সিট / Shared Seat",
  [ListingType.SUBLET]: "সাবলেট / Sublet",
  [ListingType.MESS]: "মেস / Mess",
};

export const TENANT_POLICY_LABELS: Record<TenantPolicy, string> = {
  [TenantPolicy.BACHELOR_ONLY]: "ব্যাচেলর / Bachelor",
  [TenantPolicy.FAMILY_ONLY]: "পরিবার / Family",
  [TenantPolicy.STUDENT_ONLY]: "শিক্ষার্থী / Student",
  [TenantPolicy.ANY]: "যেকোনো / Any",
};

export const GENDER_LABELS: Record<GenderPreference, string> = {
  [GenderPreference.MALE]: "ছেলে / Male",
  [GenderPreference.FEMALE]: "মেয়ে / Female",
  [GenderPreference.ANY]: "যেকোনো / Any",
};

export const LISTING_STATUS_LABELS: Record<ListingStatus, string> = {
  [ListingStatus.ACTIVE]: "সক্রিয় / Active",
  [ListingStatus.FILLED]: "ভর্তি হয়েছে / Filled",
  [ListingStatus.EXPIRED]: "মেয়াদোত্তীর্ণ / Expired",
  [ListingStatus.DRAFT]: "খসড়া / Draft",
};

export const LISTING_TYPE_COLORS: Record<ListingType, string> = {
  [ListingType.FULL_FLAT]: "bg-green-100 text-green-800",
  [ListingType.SINGLE_ROOM]: "bg-blue-100 text-blue-800",
  [ListingType.SHARED_SEAT]: "bg-orange-100 text-orange-800",
  [ListingType.SUBLET]: "bg-purple-100 text-purple-800",
  [ListingType.MESS]: "bg-red-100 text-red-800",
};

export const LISTING_STATUS_COLORS: Record<ListingStatus, string> = {
  [ListingStatus.ACTIVE]: "bg-green-100 text-green-800",
  [ListingStatus.FILLED]: "bg-blue-100 text-blue-800",
  [ListingStatus.EXPIRED]: "bg-gray-100 text-gray-600",
  [ListingStatus.DRAFT]: "bg-yellow-100 text-yellow-800",
};

export const LISTINGS_PER_PAGE = 12;
