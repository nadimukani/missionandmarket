'use client'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { apiVersion, dataset, projectId } from './src/sanity/env'
import { schemaTypes } from './src/sanity/schemas'
import { singletonTypes, structure } from './src/sanity/structure'

/** The restaurant's chevron mark (the site favicon) in the Studio's corner. */
function StudioIcon() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/icon.png" alt="" width={25} height={25} style={{ display: 'block' }} />
  )
}

export default defineConfig({
  basePath: '/studio',
  title: 'Mission + Market',
  icon: StudioIcon,
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Hide singletons from the global "create new" menu.
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    // Singletons can be edited and published, never duplicated or deleted.
    actions: (input, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? input.filter(({ action }) =>
            ['publish', 'discardChanges', 'restore'].includes(action ?? ''),
          )
        : input,
  },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
