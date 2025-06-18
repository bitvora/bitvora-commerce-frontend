'use client';

import { useWalletTransactions } from '@/contexts/wallet';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import Drawer from 'react-modern-drawer';
import { app_routes } from '@/lib/constants';
import { SemiboldBody, SemiboldHeader3, SemiboldTitle } from '@/components/Text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { convertSatsToFiat, formatDate, renderPrice } from '@/lib/helpers';
import Tabs from '@/components/Tab';
import { TransactionDetails, Skeleton } from './components';
import { Link } from '@/components/Links';
import { useAppContext } from '@/contexts';

type Params = Promise<{ id: string }>;

export default function Page(props: { params: Params }) {
  const params = use(props.params);
  const id = params.id;

  const { transactions, loading } = useWalletTransactions();
  const { currency } = useAppContext();
  const [fiatAmount, setFiatAmount] = useState(0);
  const fiatCurrency = currency?.value === 'sats' ? 'usd' : currency?.value;

  const router = useRouter();

  const transaction = transactions.find((tx) => tx.payment_hash === id);

  if (!loading && !transaction) {
    router.push(app_routes.wallet);
  }

  const handleClose = () => {
    router.push(app_routes.wallet);
  };

  useEffect(() => {
    const fetchFiatAmount = async () => {
      if (!transaction?.amount) return;

      const response = await convertSatsToFiat({
        sats: transaction?.amount / 1000,
        fiat: fiatCurrency
      });

      setFiatAmount(response?.fiat_amount || 0);
    };

    fetchFiatAmount();
  }, [fiatCurrency, transaction?.amount]);

  return (
    <Drawer open onClose={handleClose} direction="right" className="drawer" overlayOpacity={0.9}>
      {loading ? (
        <Skeleton />
      ) : (
        <div className="h-full w-full relative px-4 md:px-6 py-4 md:py-6 rounded-lg flex flex-col bg-primary-40 gap-8 md:gap-10 overflow-auto">
          <div className="flex w-full justify-between items-center">
            <SemiboldTitle className="text-light-900">Transaction Details</SemiboldTitle>

            <Link href={app_routes.wallet}>
              <button className="border-none outline-none cursor-pointer text-light-900 hover:text-light-700">
                <FontAwesomeIcon icon={faXmark} style={{ width: '20px', height: '20px' }} />
              </button>
            </Link>
          </div>

          <div className="rounded-lg px-5 lg:px-5 py-5 lg:py-6 bg-primary-150 w-full flex flex-col gap-6">
            <div className="w-full flex px-4 py-3 bg-primary-40">
              <SemiboldTitle className="text-light-900">
                {transaction?.type === 'outgoing' ? 'Withdrawal' : 'Deposit'}
              </SemiboldTitle>
            </div>

            <div className="flex flex-col gap-3 w-full items-center justify-center text-center">
              <div>
                <SemiboldHeader3 className="text-light-700 border-b-[0.5px] border-light-500 pb-1">
                  {renderPrice({ amount: transaction?.amount / 1000, currency: 'sats' })}
                </SemiboldHeader3>
              </div>

              <div>
                <SemiboldBody className="text-secondary-500">
                  {renderPrice({ amount: fiatAmount, currency: fiatCurrency })}
                </SemiboldBody>
              </div>
            </div>
          </div>

          <div className="w-full mt-5 md:mt-10 bg-primary-150 rounded-lg px-3 md:px-4 py-3 md:py-4">
            <Tabs
              tabs={[
                {
                  label: 'Details',
                  content: (
                    <div className="flex flex-col w-full gap-4 mt-2 pt-2 sm:gap-6 items-start">
                      <TransactionDetails label="Payment Hash" value={transaction?.payment_hash} />

                      {transaction?.description && (
                        <TransactionDetails label="Description" value={transaction?.description} />
                      )}

                      <TransactionDetails
                        label="Fees"
                        value={renderPrice({
                          amount: transaction?.fees_paid / 1000,
                          currency: 'sats'
                        })}
                      />

                      {transaction?.invoice && (
                        <TransactionDetails label="Invoice" value={transaction?.invoice} />
                      )}

                      <TransactionDetails
                        label="Time"
                        value={formatDate(new Date(transaction?.created_at * 1000).toISOString())}
                      />
                    </div>
                  )
                }
              ]}
            />
          </div>
        </div>
      )}
    </Drawer>
  );
}
