import type { PriceOverview } from "@/lib/price";

export type ItemStatus = "onSale" | "unreleased" | "regular";

export type WishlistItem = {
  id: string;
  steamAppId: number;
  title: string;
  imageUrl: string | null;
  storeUrl: string;
  isFree: boolean;
  priceOverview: PriceOverview | null;
  /** Campos do cache compartilhado (Game), atualizados pelo job horario. */
  releaseStatus: "released" | "unreleased";
  onSale: boolean;
  discountPercent: number;
  status: ItemStatus;
  lastSyncedAt: string | null;
  addedById: string;
  addedByName: string;
  createdAt: string;
};

export type WishlistAccess = {
  role: "owner" | "collaborator" | "none";
  canView: boolean;
  canAddItems: boolean;
  canDeleteWishlist: boolean;
};

export type Collaborator = {
  userId: string;
  name: string | null;
  email: string | null;
  joinedAt: string;
};

export type InviteState = "active" | "expired" | "revoked";

export type WishlistInvite = {
  id: string;
  token: string;
  state: InviteState;
  expiresAt: string | null;
  revokedAt: string | null;
  useCount: number;
  createdByName: string | null;
  createdAt: string;
};

export type ItemStatusCounts = { onSale: number; unreleased: number; regular: number };

export type WishlistSummary = {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string | null;
  isOwner?: boolean;
  itemCount: number;
  collaborators: { userId: string }[];
  createdAt: string;
  updatedAt: string;
};

export type WishlistDetail = Omit<WishlistSummary, "collaborators"> & {
  collaborators: Collaborator[];
  invites: WishlistInvite[];
  /** Preenchido apenas na previa de convite (`/shared`); vazio no detalhe normal. */
  items: WishlistItem[];
  counts?: ItemStatusCounts;
};

export type PageMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type WishlistsPage = PageMeta & { wishlists: WishlistSummary[] };

export type ItemsPage = PageMeta & {
  items: WishlistItem[];
  counts: ItemStatusCounts;
};

export type NotificationSettings = {
  saleDigestEnabled: boolean;
  deliveryHour: number;
};
