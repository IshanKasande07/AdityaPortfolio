import { defineQuery } from 'next-sanity'

export const SHORT_FORM_PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && (!defined(category) || category == "short-form")] | order(_createdAt desc) {
    _id,
    title,
    description,
    category,
    featured,
    stats,
    "videoUrl": videoFile.asset->url,
    "posterUrl": videoThumbnail.asset->url,
    "youtubeUrl": videoUrl
  }
`);
