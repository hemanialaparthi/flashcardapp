import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import ThemeRegistry from "./components/ThemeRegistry";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Flashcard App - Learn Faster with AI-Generated Flashcards",
  description: "Create AI-generated flashcards from any text to improve your study efficiency",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeRegistry>
            {/* Navbar is now imported and used within ThemeRegistry */}
            <main style={{ paddingTop: '0px' }}>
              {children}
            </main>
          </ThemeRegistry>
        </body>
      </html>
    </ClerkProvider>
  );
}
