import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/contexts/theme-provider";
import "./globals.css";
import "../styles/prism.css";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-spaceGrotesk",
});

export const metadata: Metadata = {
  title: "Wanswers",
  description:
    "A community of developers helping each other. Get unstuck, share ideas, and learn together. Join us, it only takes a minute.",
  applicationName: "Wanswers",
  creator: "KudryashovAV",
  authors: [{ name: "KudryashovAV", url: "https://www.linkedin.com/in/kudryashov-a-v/" }],
  keywords: ["dev", "overflow", "stack overflow", "dev overflow", "developer", "community"],
  metadataBase: new URL("https://question2answer-frontend.vercel.app/"),
  icons: ["/assets/images/logo.png"],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const getLang = async () => {
    const cookieStore = cookies();
    return cookieStore.get("lang")?.value.toLocaleLowerCase() || "en";
  };
  const lang = await getLang();

  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: "primary-gradient",
          footerActionLink: "primary-text-gradient hover:text-primary-500",
        },
      }}
    >
      <html lang={lang} suppressHydrationWarning>
        <body className={`${inter.className} ${spaceGrotesk.variable}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
