/**
 * Public service switches. Hair and nails remain fully implemented but must
 * stay unavailable until Grace confirms her certifications are complete.
 */
export const serviceAvailability = {
  tattoo: true,
  hair: false,
  nails: false,
} as const;

export const hasPublicSecondaryServices =
  serviceAvailability.hair || serviceAvailability.nails;
