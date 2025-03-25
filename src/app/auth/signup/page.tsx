'use client';

import { PrimaryButton } from '@/components/Buttons';
import { Input } from '@/components/Inputs';
import { Link } from '@/components/Links';
import { MediumBody, SemiboldHeader3, SemiboldSmallText } from '@/components/Text';
import { app_routes } from '@/lib/constants';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';

export default function Page() {
  return (
    <div className="max-w-[500px] w-full mx-auto lg:mx-[unset] flex flex-col justify-start text-left gap-6">
      <div className="flex flex-col">
        <div className="sm:mx-auto sm:text-center sm:justify-center sm:mb-4 flex lg:mx-[unset] lg:text-left lg:justify-start">
          <Image src="/finger.png" alt="" width={50} height={50} />
        </div>

        <SemiboldHeader3 className="text-light-900">Sign Up</SemiboldHeader3>

        <SemiboldSmallText className="text-light-700">Let’s get you started</SemiboldSmallText>
      </div>

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
                <PrimaryButton
                  className="w-full h-12"
                  loading={isSubmitting}
                  type="submit"
                  disabled={!isValid || !dirty}>
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
    </div>
  );
}
