import { Geist, Instrument_Serif } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const sans = Geist({
  subsets: ["latin"],
  variable: "--sans",
  display: "swap",
});

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--display",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://archiphotography.com"),
  title: {
    default: "Archi — Property photography, Adelaide",
    template: "%s — Archi",
  },
  description:
    "Archi is an Adelaide studio shooting property, interiors and architecture, with 2D and 3D floor plans to match.",
  openGraph: {
    title: "Archi — Property photography, Adelaide",
    description:
      "Property photography, interiors and architecture, plus 2D and 3D floor plans. Adelaide, South Australia.",
    type: "website",
    url: "https://archiphotography.com",
    siteName: "Archi",
    locale: "en_AU",
  },
};

export const viewport = {
  themeColor: "#f1eee7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (

    <html lang="en-AU" className={`${sans.variable} ${display.variable}`}>
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: "var(--sans)",
              fontSize: "14px",
              background: "#16150f",
              color: "#f1eee7",
              borderRadius: "0",
            },
          }}
        />
      </body>
    </html>
  );
}
