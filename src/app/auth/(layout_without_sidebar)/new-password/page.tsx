'use client';

import { PrimaryButton } from '@/components/Buttons';
import { Input } from '@/components/Inputs';
import { SemiboldHeader4, SemiboldSmallText } from '@/components/Text';
import Image from 'next/image';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

export default function Page() {
  return (
    <div className="flex flex-col gap-2 w-full text-center md:justify-center h-full md:w-[600px] min-h-[450px] md:h-auto md:border-[0.5px] md:border-light-400 md:rounded-lg lg:py-10 px-4 lg:px-10">
      <div className="mx-auto hidden md:flex">
        <Image src="/img/finger.png" alt="login" width={50} height={50} />
      </div>

      <SemiboldHeader4 className="text-light-900">Set New Password</SemiboldHeader4>

      <SemiboldSmallText className="text-light-700">
        Enter a strong password to complete this process
      </SemiboldSmallText>

      <Formik
        initialValues={{ password: '', confirm_password: '' }}
        validationSchema={Yup.object({
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
          <Form
            noValidate
            onSubmit={handleSubmit}
            className="max-w-[450px] mt-4 pt-4 mx-auto w-full">
            <div className="mb-2 pb-2">
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

            <div className="flex flex-col gap-2 absolute lg:relative bottom-8 lg:bottom-[unset] max-w-[500px] mx-auto lg:mx-[unset] lg:w-[unset] left-3 lg:left-[unset] right-3 lg:right-[unset] mt-6 pt-6">
              <div className="w-full">
                <PrimaryButton
                  className="w-full h-12"
                  loading={isSubmitting}
                  type="submit"
                  disabled={!isValid || !dirty}>
                  Save Password
                </PrimaryButton>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
