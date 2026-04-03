import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateBlog, type GenerateBlogInput } from '@/lib/blog-generator'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.user.role === 'PLATFORM_EDITOR') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!process.env.AIML_API_KEY) {
    return NextResponse.json({ error: 'AIML_API_KEY is not configured' }, { status: 500 })
  }

  const body = await req.json() as GenerateBlogInput

  if (!body.topic || !body.keyword) {
    return NextResponse.json({ error: 'topic and keyword are required' }, { status: 400 })
  }

  try {
    const result = await generateBlog(body)
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Generation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
