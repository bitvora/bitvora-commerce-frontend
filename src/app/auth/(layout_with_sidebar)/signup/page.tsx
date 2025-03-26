'use client';

import { PrimaryButton } from '@/components/Buttons';
import { Input } from '@/components/Inputs';
import { Link } from '@/components/Links';
import { MediumBody, SemiboldHeader3, SemiboldSmallText } from '@/components/Text';
import { api_url, app_routes } from '@/lib/constants';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';
// import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Page() {
  // const [email, setEmail] = useState('');
  // const [tab, setTab] = useState(1);
  const router = useRouter();

  return (
    <div className="max-w-[500px] w-full mx-auto lg:mx-[unset] flex flex-col justify-start text-left gap-6">
      <div className="flex flex-col">
        <div className="sm:mx-auto sm:text-center sm:justify-center sm:mb-4 flex lg:mx-[unset] lg:text-left lg:justify-start">
          <Image
            // src={tab === 1 ? '/img/finger.png' : '/img/email-notification.png'}
            src="/img/finger.png"
            alt=""
            width={50}
            height={50}
          />
        </div>

        <SemiboldHeader3 className="text-light-900">
          {/* {tab === 1 ? 'Sign Up' : 'Check your email!'} */}
          Sign Up
        </SemiboldHeader3>

        <SemiboldSmallText className="text-light-700">
          {/* {tab === 1 ? (
            'Let’s get you started'
          ) : (
            <>
              Please click the email verification link sent to{' '}
              <span className="text-primary-500 font-semibold">{email}</span>. Then click on
              ‘Continue’ below.
            </>
          )} */}
          Let’s get you started
        </SemiboldSmallText>
      </div>

      {/* {tab === 1 ? ( */}
      <Formik
        initialValues={{ email: '', password: '', confirm_password: '' }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email('Must be a valid email address')
            .max(255)
            .required('Email address is required'),
          password: Yup.string()
            .max(255)
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters'),
          confirm_password: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .required('Confirm password is required')
        })}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);

          try {
            const response = await fetch(`${api_url}/register`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(values)
            });

            const data = await response.json();

            if (response.status === 201) {
              toast.success('Account successfully created!');
              router.push(app_routes.login);
            } else {
              toast.error(data.message || 'An error occurred during signup');
            }
          } catch (error) {
            console.error(error);
            toast.error('Network error. Please try again.');
          } finally {
            setSubmitting(false);
          }
        }}>
        {({ errors, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <div className="mb-1 md:mb-2 pb-1 md:pb-2">
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

            <div className="mb-1 md:mb-2 pb-1 md:pb-2">
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

            <div>
              <Input
                label="Confirm Password"
                handleChange={handleChange}
                name="confirm_password"
                errors={errors}
                touched={touched}
                placeholder="Confirm Password"
                type="password"
                style={{ marginTop: '10px' }}
                value={values.confirm_password}
              />
            </div>

            <div className="flex flex-col gap-2 max-w-[500px] mx-auto lg:mx-[unset] w-full lg:w-[unset] mt-6">
              <div className="mt-4 pt-4 w-full">
                <PrimaryButton className="w-full h-12" loading={isSubmitting} type="submit">
                  Sign Up
                </PrimaryButton>
              </div>

              <div className="flex gap-2 mt-3 pt-2 items-center text-center justify-center w-full">
                <MediumBody className="text-light-700">Already have an account?</MediumBody>
                <Link href={app_routes.login}>
                  <MediumBody className="text-white hover:text-light-700">Sign In</MediumBody>
                </Link>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      {/* ) : (
        <div className="flex flex-col gap-2 absolute lg:relative bottom-10 lg:bottom-[unset] max-w-[500px] mx-auto lg:mx-[unset] w-full lg:w-[unset] left-0 lg:left-[unset] right-0 lg:right-[unset] mt-6">
          <Link href={app_routes.login}>
            <PrimaryButton className="w-full h-12">Continue</PrimaryButton>
          </Link>
        </div>
      )} */}
    </div>
  );
}
