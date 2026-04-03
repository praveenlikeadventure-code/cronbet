import cron from 'node-cron'
import { prisma } from './prisma'
import { generateBlog } from './blog-generator'

const ROTATION_TOPICS = [
  { topic: 'Is 1xBet safe to use in India in 2025?', keyword: '1xBet India', platform: '1xBet' },
  { topic: 'Top 5 cricket betting sites in India 2025', keyword: 'cricket betting sites India', platform: undefined },
  { topic: '1xBet vs Melbet: Which is better for Indian bettors?', keyword: '1xBet vs Melbet', platform: undefined },
  { topic: 'How to claim Melbet welcome bonus step by step', keyword: 'Melbet bonus', platform: 'Melbet' },
  { topic: 'Best betting apps for Android in India', keyword: 'betting apps India', platform: undefined },
  { topic: 'How to withdraw money from 22Bet — complete guide', keyword: '22Bet withdrawal', platform: '22Bet' },
  { topic: 'Best IPL betting sites 2025: Where to bet on cricket', keyword: 'IPL betting', platform: undefined },
  { topic: "How to win at sports betting: honest guide (no BS)", keyword: 'sports betting tips', platform: undefined },
]

let schedulerStarted = false

export function startAutoBlogScheduler() {
  if (schedulerStarted) return
  schedulerStarted = true

  // Run every minute to check if it's time to publish
  cron.schedule('* * * * *', async () => {
    try {
      const settings = await prisma.autoBlogSettings.findUnique({ where: { id: 'singleton' } })
      if (!settings?.enabled) return

      const now = new Date()
      const [hour, minute] = settings.publishTime.split(':').map(Number)
      if (now.getHours() !== hour || now.getMinutes() !== minute) return

      // Check if already published today
      if (settings.lastPublishedAt) {
        const lastDate = new Date(settings.lastPublishedAt)
        const isSameDay =
          lastDate.getFullYear() === now.getFullYear() &&
          lastDate.getMonth() === now.getMonth() &&
          lastDate.getDate() === now.getDate()
        if (isSameDay) return
      }

      // Pick topic
      const topicData = ROTATION_TOPICS[settings.topicIndex % ROTATION_TOPICS.length]

      console.log('[AutoBlog] Generating blog for topic:', topicData.topic)

      const blog = await generateBlog({
        topic: topicData.topic,
        keyword: topicData.keyword,
        tone: 'conversational',
        wordCount: 1200,
        platform: topicData.platform,
      })

      await prisma.blogPost.create({
        data: {
          title: blog.title,
          slug: blog.slug + '-' + Date.now(),
          content: blog.content,
          excerpt: blog.excerpt,
          category: blog.category,
          metaTitle: blog.metaTitle,
          metaDescription: blog.metaDescription,
          isPublished: true,
          publishedAt: new Date(),
        },
      })

      await prisma.autoBlogSettings.update({
        where: { id: 'singleton' },
        data: {
          lastPublishedAt: new Date(),
          topicIndex: settings.topicIndex + 1,
        },
      })

      console.log('[AutoBlog] Published:', blog.title)
    } catch (err) {
      console.error('[AutoBlog] Error:', err)
    }
  })

  console.log('[AutoBlog] Scheduler started')
}
