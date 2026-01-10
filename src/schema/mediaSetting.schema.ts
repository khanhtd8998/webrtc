// schemas/mediaSettings.schema.ts
import { z } from 'zod'

export const mediaSettingsSchema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
  microphoneId: z.string().optional(),
  cameraId: z.string().optional(),
  speakerId: z.string().optional(),
})

export type MediaSettingsFormValues =
  z.infer<typeof mediaSettingsSchema>
