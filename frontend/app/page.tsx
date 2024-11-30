// /app/layout.tsx
import './globals.css';
import NavBar from './components/NavBar';

export const metadata = {
  title: 'E-Learning Platform',
  description: 'Your one-stop learning solution!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
