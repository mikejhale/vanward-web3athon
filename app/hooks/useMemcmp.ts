import base58 from 'bs58';

const useMemcmp = (offset: number, value: string) => {
  const filter = [
    {
      memcmp: {
        offset: offset,
        bytes: value,
      },
    },
  ];

  return filter;
};

export default useMemcmp;
