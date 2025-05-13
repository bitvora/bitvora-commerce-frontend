'use client';

import Drawer from 'react-modern-drawer';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { MediumTitle, SemiboldBody, SemiboldSmallText, SemiboldTitle } from '@/components/Text';
import { PrimaryButton, RedButton, SecondaryButton } from '@/components/Buttons';
import { DarkInput, DarkTextarea } from '@/components/Inputs';
import { createProduct, deleteProduct, updateProduct } from './actions';
import { useProductContext } from './context';
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { app_routes, billing_period_hours, currencies } from '@/lib/constants';
import { CloseIcon, DeleteIcon } from '@/components/Icons';
import { Checkbox } from '@/components/Checkbox';
import Select from '@/components/Selects';
import { useAppContext } from '@/contexts';
import { CreateProductType, Product, UpdateProductType } from '@/lib/types';
import Modal from '@/components/Modal';
import { useQueryClient } from '@tanstack/react-query';
import ImageComponent from '@/components/Image';

export const AddProduct = () => {
  const { currentAccount } = useAppContext();
  const { refetchProducts } = useProductContext();

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (pathname === app_routes.products && searchParams.get('action') === 'new-product') {
      setOpen(true);
    }
  }, [pathname, searchParams]);

  const handleClose = () => {
    setOpen(false);
    router.replace(app_routes.products);
  };

  const handleOpen = () => {
    setOpen(true);
    router.replace(`${app_routes.products}?action=new-product`);
  };

  return (
    <>
      <PrimaryButton
        className="h-10 md:h-12 w-[140px] min-w-[140px] lg:w-[auto]"
        onClick={handleOpen}>
        <SemiboldSmallText>New Product</SemiboldSmallText>
      </PrimaryButton>

      <Drawer
        open={open}
        onClose={handleClose}
        direction="right"
        className="drawer"
        overlayOpacity={0.9}>
        <div className="h-full w-full relative px-4 lg:px-6 py-4 lg:py-6 rounded-lg flex flex-col bg-primary-40 gap-6 lg:gap-10">
          <div className="flex w-full justify-between items-center">
            <SemiboldTitle className="text-light-900">New Product</SemiboldTitle>

            <button className="border-none outline-none cursor-pointer" onClick={handleClose}>
              <CloseIcon />
            </button>
          </div>

          <div className="overflow-auto h-full w-full">
            <Formik
              initialValues={{
                account_id: currentAccount?.id || '',
                name: '',
                description: '',
                image: '',
                is_recurring: false,
                amount: 0,
                currency: '',
                billing_period_hours: 0
              }}
              enableReinitialize
              validationSchema={Yup.object({
                name: Yup.string().required('Name is required'),
                description: Yup.string().required('Description is required'),
                image: Yup.string().required('Image is required'),
                amount: Yup.number()
                  .required('Amount is required')
                  .positive('Amount must be greater than zero'),
                currency: Yup.string().required('Currency is required')
              })}
              onSubmit={async (values, { resetForm }) => {
                const payload: CreateProductType = {
                  account_id: currentAccount?.id,
                  name: values.name,
                  description: values.description,
                  image: values.image,
                  is_recurring: values.is_recurring,
                  amount: Number(values.amount),
                  currency: values.currency?.toLowerCase()
                };

                if (values.is_recurring) {
                  payload.billing_period_hours = values.billing_period_hours;
                }

                try {
                  const result = await createProduct(payload);

                  if (!result.success) {
                    toast.error(result.error || 'Error creating product');
                    return;
                  }

                  refetchProducts();
                  toast.success('Product created successfully');
                  handleClose();
                  resetForm();
                  router.push(`${app_routes.products}/${result?.data?.data?.id}`);
                } catch (err) {
                  console.error(err);
                  toast.error('Error creating product');
                }
              }}>
              {({
                errors,
                handleChange,
                handleSubmit,
                isSubmitting,
                touched,
                values,
                isValid,
                dirty,
                setFieldValue
              }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <div className="rounded-lg px-5 lg:px-6 py-5 lg:py-6 bg-primary-150 w-full h-full">
                    <div className="mb-2 pb-2">
                      <DarkInput
                        label="Product Name"
                        handleChange={handleChange}
                        name="name"
                        errors={errors}
                        touched={touched}
                        placeholder="Enter product name"
                        value={values.name}
                        showLabel
                        required
                      />
                    </div>

                    <div className="mb-2 pb-2">
                      <DarkTextarea
                        label="Product Description"
                        handleChange={handleChange}
                        name="description"
                        errors={errors}
                        touched={touched}
                        placeholder="Enter product description"
                        value={values.description}
                        showLabel
                        required
                        rows={3}
                      />
                    </div>

                    <div className="mb-2 pb-2">
                      <DarkInput
                        label="Product Image"
                        handleChange={handleChange}
                        name="image"
                        errors={errors}
                        touched={touched}
                        placeholder="Enter image url"
                        value={values.image}
                        type="url"
                        showLabel
                        required
                      />
                    </div>

                    <div className="w-full flex justify-between items-center gap-3">
                      <div className="mb-2 pb-2 w-2/3">
                        <DarkInput
                          label="Price"
                          handleChange={handleChange}
                          name="amount"
                          errors={errors}
                          touched={touched}
                          placeholder="0.00"
                          value={values.amount}
                          showLabel
                          required
                          type="number"
                        />
                      </div>

                      <div className="mb-2 pb-2 w-1/3">
                        <div className="mb-1 flex items-start gap-1">
                          <SemiboldBody className="text-light-700 transition-opacity duration-300">
                            Currency
                          </SemiboldBody>

                          <SemiboldBody className="text-light-700 transition-opacity duration-300">
                            *
                          </SemiboldBody>
                        </div>

                        <div className="mt-1">
                          <Select
                            placeholder="Currency"
                            value={values.currency}
                            onChange={(value) => setFieldValue('currency', value)}
                            options={currencies.map(({ label, value }) => {
                              return {
                                label,
                                value
                              };
                            })}
                            dropdownClass="bg-primary-40 product-currency"
                            className="hover:border-primary-500"
                            listClassName="text-light-700 hover:text-light-900 product-currency-item"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="w-full">
                      <Checkbox
                        label="This is a subscription product"
                        checked={values.is_recurring}
                        name="is_recurring"
                        onChange={(value) => setFieldValue('is_recurring', value)}
                      />
                    </div>

                    {values.is_recurring && (
                      <div className="mt-2">
                        <div className="mb-1 flex items-start gap-1">
                          <SemiboldBody className="text-light-700 transition-opacity duration-300">
                            Billing Period
                          </SemiboldBody>

                          <SemiboldBody className="text-light-700 transition-opacity duration-300">
                            *
                          </SemiboldBody>
                        </div>

                        <div className="mt-1">
                          <Select
                            placeholder="Billing Period"
                            value={values.billing_period_hours}
                            onChange={(value) => setFieldValue('billing_period_hours', value)}
                            options={billing_period_hours.map(({ label, value }) => {
                              return {
                                label,
                                value
                              };
                            })}
                            dropdownClass="bg-primary-40 product-currency"
                            className="hover:border-primary-500"
                            listClassName="text-light-700 hover:text-light-900 product-currency-item"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 w-full mt-6">
                    <div className="mt-4 pt-4 w-full">
                      <PrimaryButton
                        className="w-full h-12"
                        loading={isSubmitting}
                        type="submit"
                        disabled={!isValid || !dirty}>
                        Create Product
                      </PrimaryButton>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export const EditProduct = ({
  product,
  isEditOpen,
  toggleEditModal
}: {
  product: Product;
  isEditOpen: boolean;
  toggleEditModal: (value: boolean) => void;
}) => {
  const { refetchProducts } = useProductContext();

  const handleClose = () => {
    toggleEditModal(false);
  };

  const queryClient = useQueryClient();

  return (
    <Drawer
      open={isEditOpen}
      onClose={handleClose}
      direction="right"
      className="drawer"
      overlayOpacity={0.9}>
      <div className="h-full w-full relative px-6 py-6 rounded-lg flex flex-col bg-primary-40 gap-10">
        <div className="flex w-full justify-between items-center">
          <SemiboldTitle className="text-light-900">Edit Product</SemiboldTitle>

          <button className="border-none outline-none cursor-pointer" onClick={handleClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="overflow-auto h-full w-full">
          <Formik
            initialValues={{
              account_id: product?.account_id || '',
              name: product?.name || '',
              description: product?.description || '',
              image: product?.image || '',
              is_recurring: product?.is_recurring,
              amount: product?.amount || 0,
              currency: product?.currency || '',
              billing_period_hours: product?.billing_period_hours || 0
            }}
            enableReinitialize
            validationSchema={Yup.object({
              name: Yup.string().required('Name is required'),
              description: Yup.string().required('Description is required'),
              image: Yup.string().required('Image is required'),
              amount: Yup.number()
                .required('Amount is required')
                .positive('Amount must be greater than zero'),
              currency: Yup.string().required('Currency is required')
            })}
            onSubmit={async (values, { resetForm }) => {
              const payload: UpdateProductType = {
                account_id: product?.account_id,
                name: values.name,
                description: values.description,
                image: values.image,
                is_recurring: values.is_recurring,
                amount: Number(values.amount),
                currency: values.currency
              };

              if (values.is_recurring) {
                payload.billing_period_hours = values.billing_period_hours;
              }

              try {
                const result = await updateProduct(product.id, payload);

                if (!result.success) {
                  toast.error(result.error || 'Error updating product');
                  return;
                }

                refetchProducts();
                toast.success('Product updated successfully');
                await queryClient.refetchQueries({
                  queryKey: ['product', product.id]
                });
                handleClose();
                resetForm();
              } catch (err) {
                console.error(err);
                toast.error('Error updating product');
              }
            }}>
            {({
              errors,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values,
              setFieldValue
            }) => {
              return (
                <Form noValidate onSubmit={handleSubmit}>
                  <div className="rounded-lg px-6 py-6 bg-primary-150 w-full h-full">
                    <div className="mb-2 pb-2">
                      <DarkInput
                        label="Product Name"
                        handleChange={handleChange}
                        name="name"
                        errors={errors}
                        touched={touched}
                        placeholder="Enter product name"
                        value={values.name}
                        showLabel
                        required
                      />
                    </div>

                    <div className="mb-2 pb-2">
                      <DarkTextarea
                        label="Product Description"
                        handleChange={handleChange}
                        name="description"
                        errors={errors}
                        touched={touched}
                        placeholder="Enter product description"
                        value={values.description}
                        showLabel
                        required
                        rows={3}
                      />
                    </div>

                    <div className="mb-2 pb-2">
                      <DarkInput
                        label="Product Image"
                        handleChange={handleChange}
                        name="image"
                        errors={errors}
                        touched={touched}
                        placeholder="Enter image url"
                        value={values.image}
                        type="url"
                        showLabel
                        required
                      />
                    </div>

                    <div className="w-full flex justify-between items-center gap-3">
                      <div className="mb-2 pb-2 w-2/3">
                        <DarkInput
                          label="Price"
                          handleChange={handleChange}
                          name="amount"
                          errors={errors}
                          touched={touched}
                          placeholder="0.00"
                          value={values.amount}
                          showLabel
                          required
                          type="number"
                        />
                      </div>

                      <div className="mb-2 pb-2 w-1/3">
                        <div className="mb-1 flex items-start gap-1">
                          <SemiboldBody className="text-light-700 transition-opacity duration-300">
                            Currency
                          </SemiboldBody>

                          <SemiboldBody className="text-light-700 transition-opacity duration-300">
                            *
                          </SemiboldBody>
                        </div>

                        <div className="mt-1">
                          <Select
                            placeholder="Currency"
                            value={values.currency}
                            onChange={(value) => setFieldValue('currency', value)}
                            options={currencies.map(({ label, value }) => {
                              return {
                                label,
                                value
                              };
                            })}
                            dropdownClass="bg-primary-40 product-currency"
                            className="hover:border-primary-500"
                            listClassName="text-light-700 hover:text-light-900 product-currency-item"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="w-full" key={values.is_recurring ? 'recurring' : 'one-time'}>
                      <Checkbox
                        label="This is a subscription product"
                        checked={values.is_recurring}
                        name="is_recurring"
                        onChange={(value) => setFieldValue('is_recurring', value)}
                      />
                    </div>

                    {values.is_recurring && (
                      <div className="mt-2">
                        <div className="mb-1 flex items-start gap-1">
                          <SemiboldBody className="text-light-700 transition-opacity duration-300">
                            Billing Period
                          </SemiboldBody>

                          <SemiboldBody className="text-light-700 transition-opacity duration-300">
                            *
                          </SemiboldBody>
                        </div>

                        <div className="mt-1">
                          <Select
                            placeholder="Billing Period"
                            value={values.billing_period_hours}
                            onChange={(value) => setFieldValue('billing_period_hours', value)}
                            options={billing_period_hours.map(({ label, value }) => {
                              return {
                                label,
                                value
                              };
                            })}
                            dropdownClass="bg-primary-40 product-currency"
                            className="hover:border-primary-500"
                            listClassName="text-light-700 hover:text-light-900 product-currency-item"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 w-full mt-6">
                    <div className="mt-4 pt-4 w-full">
                      <PrimaryButton className="w-full h-12" loading={isSubmitting} type="submit">
                        Update Product
                      </PrimaryButton>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </Drawer>
  );
};

export const DeleteProductModal = ({
  product,
  isDeleteOpen,
  closeDeleteModal
}: {
  product: Product;
  isDeleteOpen: boolean;
  closeDeleteModal: () => void;
}) => {
  const { refetchProducts } = useProductContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeleteProduct = async (event) => {
    event.preventDefault();
    setIsDeleting(true);

    try {
      const result = await deleteProduct(product.id);

      if (!result.success) {
        toast.error(result.error || 'Error deleting product');
        return;
      }

      toast.success('Product deleted successfully');
      refetchProducts();
      closeDeleteModal();
      router.push(app_routes.products);
    } catch (err) {
      console.error(err);
      toast.error('Error deleting product');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      className="w-full max-w-[600px] p-8 flex flex-col gap-6"
      open={isDeleteOpen}
      onClose={closeDeleteModal}>
      <div className="bg-red-50 w-11 h-11 flex items-center text-center justify-center rounded-md">
        <DeleteIcon height={20} width={20} />
      </div>

      <div className="flex flex-col gap-1">
        <MediumTitle className="text-light-900">
          Are you sure you want to delete this product?
        </MediumTitle>
        <SemiboldSmallText className="text-light-700">
          This action cannot be undone.
        </SemiboldSmallText>
      </div>

      <div className="w-full flex items-center md:ml-auto justify-between md:justify-end gap-4 mt-4">
        <SecondaryButton className="h-11 w-full md:w-28" onClick={closeDeleteModal}>
          Cancel
        </SecondaryButton>

        <RedButton
          className="h-11 w-full md:w-27"
          loading={isDeleting}
          onClick={handleDeleteProduct}>
          Delete
        </RedButton>
      </div>
    </Modal>
  );
};

export const ProductImageModal = ({
  product,
  isImageOpen,
  closeImageModal
}: {
  product: Product;
  isImageOpen: boolean;
  closeImageModal: () => void;
}) => {
  return (
    <Modal
      className="max-w-[300px] max-h-[300px] sm:max-w-[450px] sm:max-h-[450px] md:max-w-[500px] md:max-h-[500px] w-full h-full px-0 py-0 flex flex-col gap-6"
      open={isImageOpen}
      onClose={closeImageModal}>
      <ImageComponent
        src={product?.image}
        alt={product?.name}
        className="w-full h-full rounded-md object-cover"
      />
    </Modal>
  );
};
