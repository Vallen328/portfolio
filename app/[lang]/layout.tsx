import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "../globals.css";
import SmoothScroll from "@/providers/smooth-scroll-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { LanguageProvider } from "@/providers/language-provider";
import { Preloader } from "@/components/layout/preloader";
import { CustomCursor } from "@/components/layout/custom-cursor";
import Navbar from "@/components/layout/navbar";
import { isValidLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { getDictionary, getContents, getSharedData } from "@/lib/loaders";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://your-domain.com"), // Change after deployment

  title: {
    default: "Vallen Dsouza | Software Engineer",
    template: "%s | Vallen Dsouza",
  },

  description:
    "Software Engineer passionate about building scalable backend systems, AI-powered products, and developer tools that solve real-world problems.",

  keywords: [
    "Vallen Dsouza",
    "Software Engineer",
    "Backend Developer",
    "Full Stack Developer",
    "Java",
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "PostgreSQL",
    "Docker",
    "AWS",
    "Artificial Intelligence",
    "Portfolio",
  ],

  authors: [
    {
      name: "Vallen Dsouza",
    },
  ],

  creator: "Vallen Dsouza",

  publisher: "Vallen Dsouza",

  applicationName: "Vallen Dsouza Portfolio",

  category: "Technology",

  classification: "Portfolio",

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },

  openGraph: {
    title: "Vallen Dsouza | Software Engineer",

    description:
    "Software Engineer passionate about building scalable backend systems, AI-powered products, and developer tools that solve real-world problems.",

    url: "https://your-domain.com",

    siteName: "Vallen Dsouza",

    locale: "en_US",

    type: "website",

    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Vallen Dsouza Portfolio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Vallen Dsouza | Software Engineer",
    description:
      "Software Engineer passionate about building scalable backend systems, AI-powered products, and developer tools that solve real-world problems.",
    images: ["/opengraph-image.png"],
  },
};

export function generateStaticParams() {
  return [{ lang: "en" }];
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const [dictionary, contents, shared] = await Promise.all([
    getDictionary(lang),
    getContents(lang),
    getSharedData(),
  ]);

  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${syne.variable} font-sans bg-background text-foreground antialiased`}
      >
        <LanguageProvider
          lang={lang}
          dictionary={dictionary}
          contents={contents}
          shared={shared}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
          >
            <CustomCursor />
            <Preloader />

            <SmoothScroll>
              <Navbar />
              {children}
            </SmoothScroll>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}