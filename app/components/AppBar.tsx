import { FC } from 'react';
import { Nav } from './Nav';
import styles from '../styles/Home.module.css';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export const AppBar: FC = () => {
  return (
    <div className={styles.AppHeader}>
      <Link href='/' passHref>
        Vanward
      </Link>
      <Nav />
      <WalletMultiButtonDynamic />
    </div>
  );
};
