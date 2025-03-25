'use client';

import { PrimaryButton } from '@/components/Buttons';
import { Input } from '@/components/Inputs';
import { Link } from '@/components/Links';
import { MediumBody, SemiboldHeader3 } from '@/components/Text';
import { app_routes } from '@/lib/constants';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

export default function Page() {
  return (
    <div className="max-w-[500px] w-full flex flex-col justify-start text-left gap-6">
      <div>
        <SemiboldHeader3 className="text-light-900">Login</SemiboldHeader3>
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
        }}>
        {({ errors, handleChange, handleSubmit, isSubmitting, touched, values }) => (
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

            <div className="mt-4 pt-4">
              <PrimaryButton className="w-full h-12" loading={isSubmitting} type="submit">
                Login
              </PrimaryButton>
            </div>

            <div className="flex gap-2 mt-3 pt-2 items-center text-center justify-center">
              <MediumBody className="text-light-700">Don&apos;t have an account?</MediumBody>
              <Link href={app_routes.signup}>
                <MediumBody className="text-white hover:text-light-700">Sign up</MediumBody>
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
