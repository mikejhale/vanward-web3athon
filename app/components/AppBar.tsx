import { FC } from 'react';
import styles from '../styles/Home.module.css';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Image from 'next/image';

export const AppBar: FC = () => {
  return (
    <div className={styles.AppHeader}>
      <span>Vanward</span>
      <WalletMultiButton />
    </div>
  );
};
