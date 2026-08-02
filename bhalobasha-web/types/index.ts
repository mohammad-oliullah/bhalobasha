export enum UserRole {
  SEEKER = "SEEKER",
  OWNER = "OWNER",
  ADMIN = "ADMIN",
}

export enum ListingType {
  FULL_FLAT = "FULL_FLAT",
  SINGLE_ROOM = "SINGLE_ROOM",
  SHARED_SEAT = "SHARED_SEAT",
  SUBLET = "SUBLET",
  MESS = "MESS",
}

export enum TenantPolicy {
  BACHELOR_ONLY = "BACHELOR_ONLY",
  FAMILY_ONLY = "FAMILY_ONLY",
  STUDENT_ONLY = "STUDENT_ONLY",
  ANY = "ANY",
}

export enum GenderPreference {
  MALE = "MALE",
  FEMALE = "FEMALE",
  ANY = "ANY",
}

export enum ListingStatus {
  ACTIVE = "ACTIVE",
  FILLED = "FILLED",
  EXPIRED = "EXPIRED",
  DRAFT = "DRAFT",
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface User {
  id: string;
  phone: string | null;
  name: string | null;
  email: string | null;
  role: UserRole;
  isVerified: boolean;
  isActive?: boolean;
  profilePhoto: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface Division {
  id: number;
  name: string;
  nameBn: string;
}

export interface District {
  id: number;
  name: string;
  nameBn: string;
  divisionId: number;
}

export interface Thana {
  id: number;
  name: string;
  nameBn: string;
  districtId: number;
}

export interface Area {
  id: number;
  name: string;
  nameBn: string;
  thanaId: number;
}

export interface ListingPhoto {
  id: string;
  url: string;
  isPrimary: boolean;
  listingId: string;
  createdAt: string;
}

export interface ListingOwner {
  id: string;
  name: string | null;
  phone: string;
  profilePhoto: string | null;
}

export interface ListingArea extends Area {
  thana: Thana & {
    district: District & {
      division: Division;
    };
  };
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  type: ListingType;
  tenantPolicy: TenantPolicy;
  genderPreference: GenderPreference;
  rent: number;
  advanceAmount: number | null;
  negotiable: boolean;
  totalRooms: number | null;
  totalBaths: number | null;
  floor: number | null;
  isFurnished: boolean;
  utilitiesIncluded: boolean;
  availableFrom: string;
  status: ListingStatus;
  contactPhone: string;
  address: string;
  areaId: number;
  ownerId: string;
  area: ListingArea;
  owner: ListingOwner;
  photos: ListingPhoto[];
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;

  // Bidding fields
  isBiddingEnabled: boolean;
  minimumBid: number | null;
  biddingDeadline: string | null;
  bids?: Bid[];
}

export interface ListingFilters {
  type?: ListingType;
  tenantPolicy?: TenantPolicy;
  genderPreference?: GenderPreference;
  areaId?: number;
  thanaId?: number;
  districtId?: number;
  divisionId?: number;
  minRent?: number;
  maxRent?: number;
  status?: ListingStatus;
}

export interface AuthVerifyResponse {
  accessToken: string;
  user: User;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  profilePhoto?: string;
}

export interface CreateListingPayload {
  title: string;
  description: string;
  type: ListingType;
  tenantPolicy: TenantPolicy;
  genderPreference: GenderPreference;
  rent: number;
  advanceAmount?: number;
  negotiable: boolean;
  totalRooms?: number;
  totalBaths?: number;
  floor?: number;
  isFurnished: boolean;
  utilitiesIncluded: boolean;
  availableFrom: string;
  status?: ListingStatus;
  contactPhone: string;
  address: string;
  areaId: number;
  photos?: string[];
}

export interface Bid {
  id: string;
  amount: number;
  message?: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN" | "EXPIRED";
  listingId: string;
  seekerId: string;
  seeker?: {
    id: string;
    name: string | null;
    phone: string;
    profilePhoto?: string | null;
  };
  listing?: Partial<Listing>;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string | null;
}

export interface BidSummary {
  isBiddingEnabled: boolean;
  minimumBid?: number | null;
  biddingDeadline?: string | null;
  totalBids: number;
  highestBid: number | null;
}

export interface BidsResponse {
  bids: Bid[];
  totalBids: number;
  highestBid: number | null;
}
