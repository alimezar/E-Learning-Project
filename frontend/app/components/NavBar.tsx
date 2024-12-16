// /app/NavBar.tsx
import Link from 'next/link';

const NavBar = () => {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/auth/register">Register</Link>
      <Link href="/auth/login">Login</Link>
      <Link href="/Chat">chat</Link>
      <Link href="/forum">Forum</Link> 
    </nav>
  );
};

export default NavBar;
