import { Helmet } from 'react-helmet-async'
import { pageMetadata, getCanonicalUrl, SITE_NAME, DEFAULT_OG_IMAGE, getSchemaOrgData } from '../lib/seo'

export function PageHead({ page, customMeta = {} }) {
  const meta = customMeta.title ? customMeta : (pageMetadata[page] || {})
  const ogImage = customMeta.ogImage || DEFAULT_OG_IMAGE
  
  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      {meta.path && <link rel="canonical" href={getCanonicalUrl(meta.path)} />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      {!customMeta.noSchema && (
        <script type="application/ld+json">
          {JSON.stringify(getSchemaOrgData())}
        </script>
      )}
    </Helmet>
  )
}
