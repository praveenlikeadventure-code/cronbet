export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { startAutoBlogScheduler } = await import('./lib/auto-blog-scheduler')
    startAutoBlogScheduler()
  }
}
