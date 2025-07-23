import { NextRequest } from "next/server"

export class HybridURLBuilder {
  
//   // Haupt-Builder: Entscheidet automatisch zwischen Path/Domain
//   static buildURL(tenant: string, locale: string, pageSlug: string, options = {}) {
//     const { forcePathBased = false, baseDomain = 'your-app.com' } = options
    
//     // Force Path-based wenn gewünscht
//     if (forcePathBased || !tenant.useCustomDomain || !tenant.customDomain) {
//       return this.buildPathURL(tenant.slug, locale, pageSlug, baseDomain)
//     }
    
//     // Custom Domain wenn verfügbar
//     return this.buildCustomDomainURL(tenant, locale, pageSlug)
//   }
  
//   // Path-based: /tenant/locale/page
//   static buildPathURL(tenantSlug, locale, pageSlug, baseDomain = 'your-app.com') {
//     const segments = [tenantSlug, locale !== 'de' ? locale : null, pageSlug]
//       .filter(Boolean)
//     return `https://${baseDomain}/${segments.join('/')}`
//   }
  
//   // Custom Domain: tenant-domain.com/locale/page
//   static buildCustomDomainURL(tenant, locale, pageSlug) {
//     const shouldShowLocale = locale !== tenant.defaultLocale
//     const segments = [shouldShowLocale ? locale : null, pageSlug].filter(Boolean)
//     return `https://${tenant.customDomain}/${segments.join('/')}`
//   }
  
  // URL Parser - Erkennt automatisch den Type
  static parseURL(request: NextRequest) {
    const host = (request.headers.get('host') || request.headers.get("host")) ?? ""
    const pathname = request.nextUrl?.pathname || request.url
    const segments = pathname.split('/').filter(Boolean)
    
    // Check if it's a custom domain
    const isCustomDomain = !host.includes('your-app.com') && !host.includes('localhost')
    
    if (isCustomDomain) {
      // Custom Domain: domain.com/[locale]/page
      const firstSegment = segments[0]
      const isLocale = ['de', 'en', 'es'].includes(firstSegment)
      
      return {
        type: 'custom-domain',
        domain: host,
        locale: isLocale ? firstSegment : 'de',
        slug: isLocale ? segments.slice(1).join('/') : segments.join('/'),
        tenant: null // Will be resolved by domain lookup
      }
    } else {
      // Path-based: your-app.com/tenant/[locale]/page
      const [tenantSlug, localeOrPage, ...restSegments] = segments
      const isLocale = ['de', 'en', 'es'].includes(localeOrPage)
      
      return {
        type: 'path-based',
        domain: host,
        tenant: tenantSlug,
        locale: isLocale ? localeOrPage : 'de',
        slug: isLocale ? restSegments.join('/') : [localeOrPage, ...restSegments].join('/')
      }
    }
  }
}