// utils/media.ts
export const formatDeviceLabel = (label?: string) => {
  if (!label) return 'Unknown device'
  return label.replace(/^Default\s*-\s*/i, '').trim()
}
