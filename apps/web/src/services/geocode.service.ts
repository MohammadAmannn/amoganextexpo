/**
 * Geocoding Service
 * Provides reverse geocoding from coordinates to human-readable addresses.
 */

export interface ReverseGeocodeResult {
  place_id?: number
  licence?: string
  osm_type?: string
  osm_id?: number
  lat?: string
  lon?: string
  display_name?: string
  address?: {
    road?: string
    suburb?: string
    city?: string
    state?: string
    postcode?: string
    country?: string
    country_code?: string
  }
}

export class GeocodeService {
  /**
   * Reverse geocodes latitude and longitude into an address.
   */
  static async reverseGeocode(latitude: number, longitude: number): Promise<ReverseGeocodeResult | null> {
    try {
      const res = await fetch(`/api/geocode?lat=${latitude}&lon=${longitude}`)
      if (!res.ok) {
        throw new Error(`Geocode request failed with status ${res.status}`)
      }
      return await res.json()
    } catch (err) {
      console.error('GeocodeService reverseGeocode failed:', err)
      return null
    }
  }
}
