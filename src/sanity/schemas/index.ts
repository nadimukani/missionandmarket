import type { SchemaTypeDefinition } from 'sanity'

import { announcement } from './announcement'
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
import { space } from './space'

export const schemaTypes: SchemaTypeDefinition[] = [
  announcement,
  siteSettings,
  homePage,
  ...menuSchemas,
  special,
  space,
  page,
  pressItem,
  person,
  jobPosting,
  galleryImage,
  richText,
]
