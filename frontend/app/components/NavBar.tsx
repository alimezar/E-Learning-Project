// /app/NavBar.tsx
import Link from 'next/link';

const NavBar = () => {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/auth/register">Register</Link>
      <Link href="/auth/login">Login</Link>
    </nav>
  );
};

export default NavBar;
