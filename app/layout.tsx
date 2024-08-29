import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { headers } from "next/headers";
import { Inter } from "next/font/google";
import Providers from "./providers";
import OCConnectWrapper from "./components/OCConnectWrapper";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const opts = {
    redirectUri: "http://localhost:3000/redirect", // Adjust this URL
  };
  const cookie = headers().get("cookie");
  return (
    <html lang="en">
      <body className={inter.className}>
        <OCConnectWrapper opts={opts} sandboxMode={true}>
          <Providers cookie={cookie}>{children}</Providers>
        </OCConnectWrapper>
      </body>
    </html>
  );
}
