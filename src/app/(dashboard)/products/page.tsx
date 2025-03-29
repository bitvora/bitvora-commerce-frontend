'use client';

import Currency from '@/components/Currency';
import { MediumHeader5 } from '@/components/Text';
import { AddProduct, ProductsTableHeader } from './components';
import { useProductContext } from './context';
import Table from '@/components/Table';

const columns = [
  { header: 'ID', accessor: 'id' },
  { header: 'Name', accessor: 'name' },
  { header: 'Amount', accessor: 'amount' }
];

export default function Page() {
  const { products, isProductsLoading } = useProductContext();

  return (
    <div className="flex flex-col gap-8 bg-primary-150 px-3 pt-6 lg:pt-0 pb-8 w-full">
      <div className="bg-transparent xl:bg-primary-50 rounded-lg px-2 lg:px-8 py-2 lg:h-[80px] w-full flex items-center justify-between">
        <div className="gap-10 items-center hidden xl:flex">
          <MediumHeader5>Products</MediumHeader5>

          <div className="hidden lg:flex">
            <Currency />
          </div>
        </div>

        <div className="flex gap-4 items-center w-full xl:w-[auto]">
          <AddProduct />
        </div>
      </div>

      <div className="w-full">
        <Table
          columns={columns}
          data={products as unknown as Record<string, unknown>[]}
          rowsPerPage={10}
          rowOnClick={(row) => alert(`Clicked on ${row.name}`)}
          actionColumn={(row) => (
            <button onClick={() => alert(`Action for ${row.name}`)}>Action</button>
          )}
          tableHeader={<ProductsTableHeader />}
          isLoading={isProductsLoading}
          emptyMessage="No Products"
        />
      </div>
    </div>
  );
}
