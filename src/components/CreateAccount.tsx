'use client';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { createAccount, fetchSession } from '@/lib/actions';
import { Account, SessionPayload } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/contexts';
import { DarkInput } from '@/components/Inputs';
import { CountrySelect } from '@/components/Selects';
import { PrimaryButton } from '@/components/Buttons';
import { app_routes } from '@/lib/constants';

export const CreateAccountForm = () => {
  const { accounts, updateCurrentAccount } = useAppContext();
  const [session, setSession] = useState<SessionPayload>({} as SessionPayload);

  useEffect(() => {
    const fetchData = async () => {
      const session = await fetchSession();

      if (session) {
        setSession(session);
      }
    };

    fetchData();
  }, []);

  return (
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

            const account: Account = result.data?.data;

            if (accounts.length < 1) {
              await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  ...session,
                  accounts: [...accounts, account],
                  activeAccount: account.id
                })
              });
            }

            toast.success('Account created successfully');
            resetForm();

            if (accounts.length < 1) {
              updateCurrentAccount(account);
              window.location.reload();
            } else {
              window.location.href = `${app_routes.accounts}/${account.id}`;
            }
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
  );
};
