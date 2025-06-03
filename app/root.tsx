import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from '@vercel/remix'
import { Analytics } from "@vercel/analytics/react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import styles from "./tailwind.css?url"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <Analytics />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <TooltipProvider>
      <LanguageProvider>
        <CartProvider>
          <Outlet />
        </CartProvider>
      </LanguageProvider>
    </TooltipProvider>
  );
}
