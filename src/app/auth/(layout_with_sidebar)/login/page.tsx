'use client';

import { PrimaryButton } from '@/components/Buttons';
import { Input } from '@/components/Inputs';
import { Link } from '@/components/Links';
import { MediumBody, SemiboldHeader3 } from '@/components/Text';
import { api_url, app_routes } from '@/lib/constants';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import secureLocalStorage from 'react-secure-storage';

export default function Page() {
  const router = useRouter();

  return (
    <div className="max-w-[500px] w-full mx-auto lg:mx-[unset] flex flex-col justify-start text-left gap-6">
      <div>
        <SemiboldHeader3 className="text-light-900">Log In</SemiboldHeader3>
      </div>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email('Must be a valid email address')
            .max(255)
            .required('Email address is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);

          try {
            // Step 1: Send login request
            const response = await fetch(`${api_url}/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(values)
            });

            const data = await response.json();

            if (response.status === 201) {
              const sessionId = data?.data?.id;
              if (!sessionId) {
                toast.error('Failed to retrieve session ID.');
                return;
              }

              let accounts = [];
              let activeAccount = '';

              try {
                // Step 2: Try fetching user accounts
                const accountsResponse = await fetch(`${api_url}/account`, {
                  headers: { 'Session-ID': sessionId }
                });

                if (accountsResponse.ok) {
                  const accountsData = await accountsResponse.json();
                  accounts = accountsData.data ?? [];
                  activeAccount = accounts.length > 0 ? accounts[0]?.id : '';
                } else {
                  console.error('Failed to fetch accounts:', accountsResponse.statusText);
                }
              } catch (accountErr) {
                console.error('Error fetching accounts:', accountErr);
              }

              // Step 3: Always make this request, even if accounts fetching fails
              await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  id: sessionId,
                  user_id: data?.data?.user_id,
                  session_token: data?.data?.session_token,
                  logged_in_at: data?.data?.logged_in_at,
                  status: data?.data?.status,
                  accounts,
                  activeAccount
                })
              });

              // Step 4: Store accounts locally
              secureLocalStorage.setItem('accounts', JSON.stringify(accounts));
              const currentAccount = accounts.find((acc) => acc.id === activeAccount);
              if (currentAccount) {
                secureLocalStorage.setItem('currentAccount', JSON.stringify(currentAccount));
              }

              toast.success(data?.message ?? 'User logged in successfully');
              router.push(app_routes.dashboard);
            } else if (response.status === 401) {
              toast.error('Invalid credentials. Please try again.');
            } else {
              toast.error(data.message || 'An error occurred during login');
            }
          } catch (err) {
            console.error(err)
            toast.error('Invalid credentials.');
          } finally {
            setSubmitting(false);
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
          dirty
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <div className="mb-2 pb-2">
              <Input
                label="Email Address"
                handleChange={handleChange}
                name="email"
                errors={errors}
                touched={touched}
                placeholder="Email Address"
                type="email"
                value={values.email}
              />
            </div>

            <div>
              <Input
                label="Password"
                handleChange={handleChange}
                name="password"
                errors={errors}
                touched={touched}
                placeholder="Password"
                type="password"
                style={{ marginTop: '10px' }}
                value={values.password}
              />
            </div>

            <div className="mt-2 pt-2 flex justify-end">
              <Link href={app_routes.forgot_password}>
                <MediumBody className="text-white hover:text-light-700">
                  Forgot Password?
                </MediumBody>
              </Link>
            </div>

            <div className="flex flex-col gap-2 absolute lg:relative bottom-6 lg:bottom-[unset] max-w-[500px] mx-auto lg:mx-[unset] w-full lg:w-[unset] left-0 lg:left-[unset] right-0 lg:right-[unset] mt-6">
              <div className="mt-4 pt-4 w-full">
                <PrimaryButton
                  className="w-full h-12"
                  loading={isSubmitting}
                  type="submit"
                  disabled={!isValid || !dirty}>
                  Log In
                </PrimaryButton>
              </div>

              <div className="flex gap-2 mt-3 pt-2 items-center text-center justify-center w-full">
                <MediumBody className="text-light-700">Don&apos;t have an account?</MediumBody>
                <Link href={app_routes.signup}>
                  <MediumBody className="text-white hover:text-light-700">Sign up</MediumBody>
                </Link>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
