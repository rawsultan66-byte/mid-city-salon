
import './globals.css'
export const metadata = { title: 'Mid City Salon - Where Style Meets Community', description: 'Milwaukee WI - 424 E Locust St' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className="bg-[#FAF8F5]">{children}</body></html>
}
