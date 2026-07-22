import type { SchemaTypeDefinition } from 'sanity'

import {
  galleryImage,
  homePage,
  jobPosting,
  page,
  person,
  pressItem,
  richText,
  special,
} from './content'
import { menuSchemas } from './menu'
import { siteSettings } from './settings'

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  homePage,
  ...menuSchemas,
  special,
  page,
  pressItem,
  person,
  jobPosting,
  galleryImage,
  richText,
]
