export type RescuerEligibilityInput = {
  status?: string | null;
  isAvailableNow?: boolean | null;
  userStatus?: string | null;
  verifiedAt?: Date | string | null;
  deletedAt?: Date | string | null;
};

export function isEligibleForAssignment({
  status,
  isAvailableNow,
  userStatus,
  verifiedAt,
  deletedAt,
}: RescuerEligibilityInput): boolean {
  if (deletedAt) return false;
  if (status !== 'VERIFIED') return false;
  if (userStatus !== 'ACTIVE') return false;
  if (!isAvailableNow) return false;
  if (!verifiedAt) return false;

  return true;
}
