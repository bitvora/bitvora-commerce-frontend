'use client';

import Drawer from 'react-modern-drawer';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { SemiboldSmallerText, SemiboldTitle } from '@/components/Text';
import { PrimaryButton } from '@/components/Buttons';
import { DarkInput } from '@/components/Inputs';
import { CountrySelect } from '@/components/Selects';
import { createAccount } from '@/lib/actions';
import { useAppContext } from '@/app/contexts';

export const CreateAccount = () => {
  const { refetchAccount, accounts, isAccountLoading } = useAppContext();

  return (
    <Drawer
      open={!isAccountLoading && accounts.length < 1}
      direction="right"
      className="drawer"
      overlayOpacity={0.9}>
      <div className="h-full w-full relative px-6 py-6 rounded-lg flex flex-col bg-primary-40 gap-10">
        <div className="flex w-full flex-col justify-center text-center md:text-start md:justify-start">
          <SemiboldTitle className="text-light-900">Create Account</SemiboldTitle>

          <SemiboldSmallerText className="text-light-700">
            Only account name is required. All other fields are optional.
          </SemiboldSmallerText>
        </div>

        <div className="overflow-auto h-full w-full">
          <Formik
            initialValues={{
              name: '',
              logo: '',
              address_line1: '',
              address_line2: '',
              city: '',
              state: '',
              postal_code: '',
              country: ''
            }}
            validationSchema={Yup.object({
              name: Yup.string().required('Name is required')
            })}
            onSubmit={async (values, { resetForm }) => {
              try {
                const result = await createAccount(values);

                if (!result.success) {
                  toast.error(result.error || 'Error creating account');
                  return;
                }

                refetchAccount();
                toast.success('Account created successfully');
                resetForm();
              } catch (err) {
                console.error(err);
                toast.error('Error creating account');
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
                <div className="rounded-lg px-6 py-6 bg-primary-150 w-full h-full">
                  <div className="mb-2 pb-2">
                    <DarkInput
                      label="Name"
                      handleChange={handleChange}
                      name="name"
                      errors={errors}
                      touched={touched}
                      placeholder="Enter Account Name"
                      value={values.name}
                      showLabel
                      required
                    />
                  </div>

                  <div className="mb-2 pb-2">
                    <DarkInput
                      label="Logo"
                      handleChange={handleChange}
                      name="logo"
                      errors={errors}
                      touched={touched}
                      type="url"
                      placeholder="Enter Logo URL"
                      value={values.logo}
                      showLabel
                    />
                  </div>

                  <div className="mb-2 pb-2">
                    <DarkInput
                      label="Address Line 1"
                      handleChange={handleChange}
                      name="address_line1"
                      errors={errors}
                      touched={touched}
                      placeholder="Enter Address Line 1"
                      value={values.address_line1}
                      showLabel
                    />
                  </div>

                  <div className="mb-2 pb-2">
                    <DarkInput
                      label="Address Line 2"
                      handleChange={handleChange}
                      name="address_line2"
                      errors={errors}
                      touched={touched}
                      placeholder="Enter Address Line 2"
                      value={values.address_line2}
                      showLabel
                    />
                  </div>

                  <div className="w-full flex justify-between items-center gap-3">
                    <div className="mb-2 pb-2 w-full">
                      <DarkInput
                        label="City"
                        handleChange={handleChange}
                        name="city"
                        errors={errors}
                        touched={touched}
                        placeholder="Enter City"
                        value={values.city}
                        showLabel
                      />
                    </div>

                    <div className="mb-2 pb-2 w-full">
                      <DarkInput
                        label="State/province"
                        handleChange={handleChange}
                        name="state"
                        errors={errors}
                        touched={touched}
                        placeholder="Enter State"
                        value={values.state}
                        showLabel
                      />
                    </div>
                  </div>

                  <div className="w-full flex justify-between items-center gap-3">
                    <div className="mb-2 pb-2 w-full">
                      <DarkInput
                        label="Postal Code"
                        handleChange={handleChange}
                        name="postal_code"
                        errors={errors}
                        touched={touched}
                        placeholder="Enter Postal Code"
                        value={values.postal_code}
                        showLabel
                      />
                    </div>

                    <div className="mb-2 pb-2 w-full">
                      <CountrySelect
                        handleChange={async (value) => await setFieldValue('country', value)}
                        errors={errors}
                        touched={touched}
                        value={values.country}
                        name="country"
                        label="Country"
                        placeholder="Select your Country"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full mt-6">
                  <div className="mt-4 pt-4 w-full">
                    <PrimaryButton
                      className="w-full h-12"
                      loading={isSubmitting}
                      type="submit"
                      disabled={!isValid || !dirty}>
                      Create Account
                    </PrimaryButton>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Drawer>
  );
};
