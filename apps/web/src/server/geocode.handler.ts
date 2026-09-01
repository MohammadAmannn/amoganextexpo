import { NextRequest, NextResponse } from 'next/server'

export async function handleGeocodeRequest(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Latitude and Longitude are required' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
      {
        headers: {
          'User-Agent': 'AmogaDS/1.0 (contact@amoga.io)',
          'Accept-Language': 'en'
        },
        next: { revalidate: 3600 }
      }
    )

    if (!response.ok) {
      throw new Error(`Nominatim returned status ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Server-side geocoding failed:', error)
    return NextResponse.json({ error: error.message || 'Geocoding failed' }, { status: 500 })
  }
}
