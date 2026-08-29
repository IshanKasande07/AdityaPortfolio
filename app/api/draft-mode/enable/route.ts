import { client } from '@/sanity/lib/client'
import { defineEnableDraftMode } from 'next-sanity/draft-mode'

// We need a helper to get the token if we want to support token authentication
// For this basic setup, if SANITY_API_READ_TOKEN is set, it will be used.
const token = process.env.SANITY_API_READ_TOKEN

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token }),
})
