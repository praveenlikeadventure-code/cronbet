import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Each model is checked independently — no single early-exit controls all.
  // This means admins can never be wiped even if platforms table is somehow empty.

  // --- Admin users ---
  const adminCount = await prisma.adminUser.count()
  if (adminCount > 0) {
    console.log(`⏭️  Skipping admin seed — ${adminCount} user(s) already exist.`)
  } else {
    const passwordHash = await bcrypt.hash('Admin@123', 12)
    await prisma.adminUser.upsert({
      where: { email: 'admin@cronbet.com' },
      update: {}, // never overwrite
      create: {
        email: 'admin@cronbet.com',
        name: 'Super Admin',
        passwordHash,
        role: 'SUPER_ADMIN',
      },
    })
    console.log('✅ Default admin user created.')
  }

  // --- Platforms ---
  const platformCount = await prisma.bettingPlatform.count()
  if (platformCount > 0) {
    console.log(`⏭️  Skipping platform seed — ${platformCount} platform(s) already exist.`)
    return // no need to run the rest if platforms exist
  }
  console.log('🌱 No platforms found — seeding platforms and sample content...')

  // Seed betting platforms
  const platforms = [
    {
      name: '1xBet',
      slug: '1xbet',
      bonusText: '100% up to $100',
      affiliateUrl: '#',
      rating: 4.7,
      isFeatured: true,
      rank: 1,
      pros: ['Huge sports selection', 'Live streaming', 'Fast payouts', 'Many payment methods'],
      cons: ['Complex interface', 'High wagering requirements'],
      sports: ['Football', 'Cricket', 'eSports', 'Crypto-Friendly'],
      payments: ['Visa', 'Mastercard', 'Bitcoin', 'Ethereum', 'Skrill', 'Neteller'],
      minDeposit: '$1',
      payoutSpeed: '1-3 days',
      license: 'Curaçao',
      description: '1xBet is one of the world\'s largest online betting platforms, offering thousands of sports markets and a comprehensive casino section.',
      visibilityType: 'ALLOWED_ONLY',
      allowedCountries: ['IN', 'BD', 'PK', 'NG', 'KE', 'GH', 'UG', 'TZ', 'RU', 'UA', 'BR', 'MX'],
      blockedCountries: [],
    },
    {
      name: 'Melbet',
      slug: 'melbet',
      bonusText: '100% up to $130',
      affiliateUrl: '#',
      rating: 4.5,
      isFeatured: true,
      rank: 2,
      pros: ['Great welcome bonus', 'Wide sports coverage', 'Mobile app', 'Live betting'],
      cons: ['Slow customer support', 'Limited crypto options'],
      sports: ['Football', 'Cricket', 'Crypto-Friendly'],
      payments: ['Visa', 'Mastercard', 'Bitcoin', 'Ethereum', 'WebMoney', 'Skrill'],
      minDeposit: '$1',
      payoutSpeed: '1-5 days',
      license: 'Curaçao',
      description: 'Melbet offers an impressive sportsbook with over 1000 events daily and a generous welcome bonus for new players.',
      visibilityType: 'ALLOWED_ONLY',
      allowedCountries: ['IN', 'BD', 'PK', 'NG', 'KE', 'GH', 'UG', 'TZ', 'RU', 'UA'],
      blockedCountries: [],
    },
    {
      name: '22Bet',
      slug: '22bet',
      bonusText: '100% up to $300',
      affiliateUrl: '#',
      rating: 4.4,
      isFeatured: true,
      rank: 3,
      pros: ['High welcome bonus', 'Crypto-friendly', 'Good odds', 'Fast registration'],
      cons: ['Limited live streaming', 'No phone support'],
      sports: ['Football', 'eSports', 'Crypto-Friendly'],
      payments: ['Visa', 'Mastercard', 'Bitcoin', 'Ethereum', 'Litecoin', 'Skrill'],
      minDeposit: '$1',
      payoutSpeed: '1-3 days',
      license: 'Curaçao',
      description: '22Bet provides one of the largest welcome bonuses in the industry along with a crypto-friendly platform and competitive odds.',
      visibilityType: 'ALLOWED_ONLY',
      allowedCountries: ['IN', 'BD', 'PK', 'NG', 'KE', 'GH', 'BR', 'UG', 'TZ'],
      blockedCountries: [],
    },
    {
      name: 'LeonBet',
      slug: 'leonbet',
      bonusText: '100% up to $200',
      affiliateUrl: '#',
      rating: 4.3,
      isFeatured: true,
      rank: 4,
      pros: ['Clean interface', 'Reliable platform', 'Good customer support', 'Mobile app'],
      cons: ['Smaller bonus than competitors', 'Limited payment methods'],
      sports: ['Football', 'Cricket'],
      payments: ['Visa', 'Mastercard', 'Bitcoin', 'Neteller'],
      minDeposit: '$5',
      payoutSpeed: '1-3 days',
      license: 'Curaçao',
      description: 'LeonBet is a reliable betting platform known for its clean interface and solid customer support.',
      visibilityType: 'ALL_COUNTRIES',
      allowedCountries: [],
      blockedCountries: [],
    },
    {
      name: 'Mostbet',
      slug: 'mostbet',
      bonusText: '125% up to $300',
      affiliateUrl: '#',
      rating: 4.2,
      isFeatured: true,
      rank: 5,
      pros: ['High bonus percentage', 'Live casino', 'Fast withdrawals', 'Many sports'],
      cons: ['Verification can be slow', 'Complex bonus terms'],
      sports: ['Football', 'Cricket', 'Crypto-Friendly'],
      payments: ['Visa', 'Mastercard', 'Bitcoin', 'Ethereum', 'UPI', 'Skrill', 'Neteller'],
      minDeposit: '$1',
      payoutSpeed: '1-3 days',
      license: 'Curaçao',
      description: 'Mostbet offers a 125% welcome bonus and is especially popular in Asia with excellent cricket and kabaddi coverage.',
      visibilityType: 'ALLOWED_ONLY',
      allowedCountries: ['IN', 'BD', 'PK', 'NG', 'KE', 'TZ', 'UG'],
      blockedCountries: [],
    },
    {
      name: 'Bet365',
      slug: 'bet365',
      bonusText: 'Bet $1 Get $3 in Bet Credits',
      affiliateUrl: '#',
      rating: 4.8,
      isFeatured: false,
      rank: 6,
      pros: ['Industry leader', 'Excellent live streaming', 'Top-tier app', 'Cash out feature'],
      cons: ['Lower welcome bonus', 'Strict KYC'],
      sports: ['Football', 'Cricket', 'eSports'],
      payments: ['Visa', 'Mastercard', 'PayPal', 'Skrill', 'Neteller', 'Bank Transfer'],
      minDeposit: '$10',
      payoutSpeed: '1-5 days',
      license: 'UK Gambling Commission, Gibraltar',
      description: 'Bet365 is the world\'s largest online sports betting company, trusted by millions worldwide for its reliability and extensive markets.',
      visibilityType: 'BLOCKED_ONLY',
      allowedCountries: [],
      blockedCountries: ['US'],
    },
    {
      name: 'Betway',
      slug: 'betway',
      bonusText: '100% up to $250',
      affiliateUrl: '#',
      rating: 4.4,
      isFeatured: false,
      rank: 7,
      pros: ['Licensed and trusted', 'eSports betting', 'Good mobile app', 'Regular promotions'],
      cons: ['Average odds', 'Limited crypto support'],
      sports: ['Football', 'Cricket', 'eSports'],
      payments: ['Visa', 'Mastercard', 'Skrill', 'Neteller', 'Bank Transfer'],
      minDeposit: '$10',
      payoutSpeed: '1-5 days',
      license: 'Malta Gaming Authority, UK Gambling Commission',
      description: 'Betway is a fully licensed and regulated betting platform known for its eSports coverage and trustworthy operations.',
      visibilityType: 'ALL_COUNTRIES',
      allowedCountries: [],
      blockedCountries: [],
    },
    {
      name: 'Pin-Up',
      slug: 'pin-up',
      bonusText: '120% up to $500',
      affiliateUrl: '#',
      rating: 4.1,
      isFeatured: false,
      rank: 8,
      pros: ['Large bonus amount', 'Casino + Sports', 'Crypto friendly', 'Loyalty program'],
      cons: ['Newer platform', 'Limited banking options in some regions'],
      sports: ['Football', 'Crypto-Friendly'],
      payments: ['Visa', 'Mastercard', 'Bitcoin', 'Ethereum', 'Skrill'],
      minDeposit: '$10',
      payoutSpeed: '1-3 days',
      license: 'Curaçao',
      description: 'Pin-Up Bet combines an attractive casino and sportsbook with one of the largest welcome bonuses available for new players.',
      visibilityType: 'ALL_COUNTRIES',
      allowedCountries: [],
      blockedCountries: [],
    },
  ]

  for (const platform of platforms) {
    const data = {
      ...platform,
      pros: JSON.stringify(platform.pros),
      cons: JSON.stringify(platform.cons),
      sports: JSON.stringify(platform.sports),
      payments: JSON.stringify(platform.payments),
      allowedCountries: JSON.stringify(platform.allowedCountries),
      blockedCountries: JSON.stringify(platform.blockedCountries),
    }
    await prisma.bettingPlatform.upsert({
      where: { slug: platform.slug },
      update: {}, // never overwrite existing platform data
      create: data,
    })
  }

  // Seed sample blog posts
  await prisma.blogPost.upsert({
    where: { slug: 'best-betting-sites-2024' },
    update: {}, // never overwrite existing blog posts
    create: {
      title: 'Best Betting Sites in 2024: Our Top Picks',
      slug: 'best-betting-sites-2024',
      content: `# Best Betting Sites in 2024

Finding the right betting site can make all the difference in your online gambling experience. We've tested dozens of platforms to bring you the very best options available today.

## What Makes a Great Betting Site?

When evaluating betting platforms, we consider several key factors:

- **Welcome Bonus**: The size and fairness of the welcome offer
- **Sports Coverage**: How many sports and markets are available
- **Odds Quality**: Competitive odds across major events
- **Payment Methods**: Variety of deposit and withdrawal options
- **Mobile Experience**: Quality of mobile apps and responsive design
- **Customer Support**: Availability and helpfulness of support

## Our Top Picks

### 1. 1xBet - Best Overall
1xBet consistently ranks at the top of our recommendations due to its massive sports selection and competitive odds.

### 2. Melbet - Best Welcome Bonus
Melbet's 100% up to $130 welcome offer is one of the most generous in the industry.

### 3. 22Bet - Best for Crypto Users
22Bet accepts over 50 cryptocurrencies, making it the top choice for crypto bettors.

## Conclusion

Each of these platforms offers something unique. Choose based on what matters most to you — whether that's bonus size, sports selection, or payment flexibility.`,
      excerpt: 'Discover the best betting sites of 2024 with our expert reviews and comparisons. Find the perfect platform for your needs.',
      category: 'Platform Reviews',
      metaTitle: 'Best Betting Sites 2024 | CRONBET Expert Reviews',
      metaDescription: 'Compare the best betting sites of 2024. Expert reviews of 1xBet, Melbet, 22Bet and more. Find the best bonuses and odds.',
      isPublished: true,
      publishedAt: new Date(),
    },
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
