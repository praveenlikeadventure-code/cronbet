import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { platformName } = await req.json()

    if (!platformName) return NextResponse.json({ error: 'platformName is required' }, { status: 400 })

    const apiKey = process.env.AIML_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'AIML API key not configured' }, { status: 500 })

    const prompt = `Professional sports betting logo for ${platformName}, minimalist, dark background, no text, clean icon design`

    const res = await fetch('https://api.aimlapi.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        size: '256x256',
        n: 1,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('AIML API error:', err)
      return NextResponse.json({ error: 'Logo generation failed' }, { status: 502 })
    }

    const data = await res.json()
    const imageUrl = data?.data?.[0]?.url

    if (!imageUrl) return NextResponse.json({ error: 'No image returned' }, { status: 502 })

    return NextResponse.json({ url: imageUrl })
  } catch (err) {
    console.error('Logo generate error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
