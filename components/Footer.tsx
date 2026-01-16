import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-lol-gold/30 bg-lol-dark-accent/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* About */}
          <div>
            <h3 className="text-lol-gold font-bold mb-3">About</h3>
            <ul className="space-y-2 text-lol-light text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-lol-gold transition-colors"
                >
                  About League of Gacha
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="hover:text-lol-gold transition-colors"
                >
                  로스터 자랑
                </Link>
              </li>
              <li>
                <Link
                  href="/my-page"
                  className="hover:text-lol-gold transition-colors"
                >
                  내 전적
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lol-gold font-bold mb-3">Legal</h3>
            <ul className="space-y-2 text-lol-light text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-lol-gold transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-lol-gold transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lol-gold font-bold mb-3">Resources</h3>
            <ul className="space-y-2 text-lol-light text-sm">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-lol-gold transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://www.riotgames.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-lol-gold transition-colors"
                >
                  Riot Games
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-lol-gold/20 mb-6"></div>

        {/* Copyright and Info */}
        <div className="text-center space-y-2">
          <p className="text-lol-light text-sm">
            Made with ⚡ by League of Legends fans | Data includes LCK, LPL,
            LEC, Worlds, and MSI (2013-2024)
          </p>
          <p className="text-lol-light/70 text-xs">
            © {currentYear} League of Gacha. This is an unofficial fan-made
            project and is not affiliated with Riot Games, Inc.
          </p>
          <p className="text-lol-light/70 text-xs">
            League of Legends and all associated properties are trademarks or
            registered trademarks of Riot Games, Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}
