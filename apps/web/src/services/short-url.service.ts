/**
 * Short URL Service
 * Handles client & server-side URL shortening, expiration calculations, and identifier generation.
 */

import { generateShortId, toBase64Url, buildSelfContainedShortUrl } from '@/lib/short-url-client'
import { saveShortUrl, getShortUrl } from '@/lib/short-url-store'

export class ShortUrlService {
  /**
   * Generates a random short ID of specified length.
   */
  static generateId(length = 6): string {
    return generateShortId(length)
  }

  /**
   * Encodes a string to a base64url format.
   */
  static encodeUrl(url: string): string {
    return toBase64Url(url)
  }

  /**
   * Builds a self-contained client-side short URL with embedded expiration.
   */
  static buildSelfContainedUrl(
    origin: string,
    configHash: string,
    durationHours: number
  ): { shortUrl: string; expiresAt: string } {
    return buildSelfContainedShortUrl(origin, configHash, durationHours)
  }

  /**
   * Stores a shortened URL mapping with expiration timestamp.
   */
  static async saveUrl(targetUrl: string, expiresAtMs: number): Promise<{ shortUrlSuffix: string }> {
    return saveShortUrl(targetUrl, expiresAtMs)
  }

  /**
   * Retrieves a shortened URL target mapping.
   */
  static async getUrl(shortUrlSuffix: string): Promise<{ targetUrl: string; expiresAt: string } | null> {
    const entry = await getShortUrl(shortUrlSuffix)
    if (!entry) return null
    return {
      targetUrl: entry.targetUrl,
      expiresAt: entry.expiresAt,
    }
  }
}
