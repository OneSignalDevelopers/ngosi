import Link from 'next/link'

const HeaderBar = () => (
  <nav className="flex flex-none justify-between p-2 h-12 bg-accent-primary text-sm text-black font-bold min-w-full px-6 py-3">
    <Link href="/">
      <a>Home</a>
    </Link>
    <Link href="/presos">
      <a>Presos</a>
    </Link>
    <Link href="/surveys">
      <a>Surveys</a>
    </Link>
    <Link href="/groupies">
      <a>Audience</a>
    </Link>
    <Link href="/account">
      <a>Account</a>
    </Link>
  </nav>
)

export default HeaderBar
