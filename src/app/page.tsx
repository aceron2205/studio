
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Menu, ChevronRight, FileText, SettingsIcon, Search } from 'lucide-react'; // Added FileText and SettingsIcon, Search is unused

// Mock data for recent audits
const recentAudits = [
  { id: 'audit-1', date: 'Apr 10, 2024', href: '/audit-scan/recent-1' },
  { id: 'audit-2', date: 'Mar 20, 2024', href: '/audit-scan/recent-2' },
  { id: 'audit-3', date: 'Feb 05, 2024', href: '/audit-scan/recent-3' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <div className="flex-grow p-4 md:p-6 max-w-md mx-auto w-full">
        {/* Top Section */}
        <header className="mb-6">
          <div className="flex justify-between items-center mb-4">
            {/* Hamburger Menu (placeholder or future functionality) */}
            <Button variant="ghost" size="icon" aria-label="Menu">
              <Menu className="h-6 w-6" />
            </Button>
            {/* Optional: Add a logo or app name here if needed */}
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Manage Fire Extinguishers
          </h1>
          <Link href="/start-audit" passHref>
            <Button size="lg" className="w-full text-lg py-3">
              Start Audit
            </Button>
          </Link>
        </header>

        <Separator className="my-6" />

        {/* Recent Audits Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-3">
            Recent Audits
          </h2>
          <div className="space-y-2">
            {recentAudits.map((audit) => (
              <Link href={audit.href} key={audit.id} passHref>
                <div className="flex items-center justify-between p-3 bg-card rounded-lg shadow-sm hover:bg-muted cursor-pointer border border-border transition-colors">
                  <span className="text-sm font-medium text-card-foreground">{audit.date}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <Separator className="my-6" />

        {/* More Section */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            More
          </h2>
          <div className="space-y-3">
            <Link href="/view-plans" passHref> {/* Changed from #reports to /view-plans */}
              <Button variant="outline" className="w-full justify-start text-base py-3">
                <FileText className="mr-2 h-5 w-5" />
                View Reports
              </Button>
            </Link>
            <Link href="/#" passHref> {/* Placeholder for Settings */}
              <Button variant="outline" className="w-full justify-start text-base py-3">
                <SettingsIcon className="mr-2 h-5 w-5" />
                Settings
              </Button>
            </Link>
          </div>
        </section>
      </div>
      {/* Footer is intentionally kept minimal or removed to match image, MobileNav will be outside this main content flow */}
    </div>
  );
}
