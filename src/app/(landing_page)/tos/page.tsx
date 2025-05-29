'use client';

import { MediumBody, MediumSmallText, SemiboldHeader3 } from '@/components/Text';

export default function Page() {
  return (
    <div className="w-full flex flex-col items-center gap-8 pt-[150px] container mx-auto px-3">
      <SemiboldHeader3>Terms of Service</SemiboldHeader3>
      <div className="flex flex-col gap-8">
        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Acceptance of Terms</span> By accessing or
          using the services provided by Bitvora Inc. (&quot;Company,&quot; &quot;we,&quot;
          &quot;us,&quot; or &quot;our&quot;), including our Bitcoin and Lightning API and Bitvora
          Commerce (&quot;Services&quot;), you (&quot;Client,&quot; &quot;you,&quot; or
          &quot;your&quot;) agree to comply with and be bound by these Terms of Service
          (&quot;Terms&quot;).
          <br />
          These Terms constitute a binding legal agreement between you and Bitvora Inc. If you do
          not agree to these Terms, you may not use our Services. Bitvora Inc. reserves the right to
          modify these Terms at any time, and such modifications will be effective upon posting on
          our website or by other means of communication. Your continued use of the Services after
          any such modifications constitutes your acceptance of the revised Terms.
        </MediumBody>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Description of Services</span> Bitvora Inc.
          provides access to a Bitcoin and Lightning API and a commerce platform (Bitvora Commerce),
          enabling Clients to facilitate payments and transfers of digital assets. Our Services are
          designed to offer seamless integration with your existing systems, allowing for efficient
          and secure transactions.
          <br />
          The Services are provided on an &quot;as-is&quot; and &quot;as-available&quot; basis, and
          we make no representations or warranties regarding their reliability, uptime, or
          suitability for your specific needs.
        </MediumBody>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Service Availability</span> While Bitvora Inc.
          endeavors to ensure that the Services are available 24/7, we do not guarantee
          uninterrupted or error-free operation. We may, at our discretion, perform scheduled or
          unscheduled maintenance, updates, or upgrades, which may result in temporary service
          interruptions. You acknowledge and agree that we are not liable for any damages or losses
          resulting from such interruptions. Modifications to Services Bitvora Inc. reserves the
          right to modify, suspend, or discontinue any part of the Services at any time, with or
          without notice. This may include adding or removing features, functionality, or content.
          We are not liable to you or any third party for any modifications, suspensions, or
          discontinuations of the Services.
        </MediumBody>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Legal Compliance</span> Our Services operate
          under the laws of Canada and are regulated by the Financial Transactions and Reports
          Analysis Centre of Canada (FINTRAC). By using our Services, you agree to comply with all
          applicable Canadian laws, as well as the laws of your local jurisdiction. It is your
          responsibility to ensure that your use of the Services is legal in your country or region.
        </MediumBody>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Prohibited Activities</span> You agree not to
          use our Services for any illegal activities, including but not limited to money
          laundering, illicit trade, terrorist financing, fraud, or any other activities that
          violate Canadian law or the laws of your local jurisdiction. We reserve the right to
          investigate and report any suspicious activities to the relevant authorities and to
          cooperate fully with law enforcement agencies.
        </MediumBody>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Client Responsibilities</span> Clients are
          responsible for ensuring their use of the Services complies with all applicable laws and
          regulations. You agree to provide accurate, current, and complete information during
          registration and to update such information as necessary. Bitvora Inc. is not responsible
          for any losses or damages resulting from inaccurate information.
        </MediumBody>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Client Responsibilities</span> Clients are
          responsible for ensuring their use of the Services complies with all applicable laws and
          regulations. You agree to provide accurate, current, and complete information during
          registration and to update such information as necessary. Bitvora Inc. is not responsible
          for any losses or damages resulting from inaccurate information.
          <br />
          We reserve the right to request additional information to verify your identity, business
          operations, and compliance. This may include government-issued ID, proof of address, and
          detailed business descriptions. Failure to comply may result in suspension or termination.
        </MediumBody>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">No Fiduciary Relationship</span> Bitvora Inc.
          acts solely as a service provider and does not establish any fiduciary relationship with
          users. Clients acknowledge that Bitvora does not act as a trustee or custodian and owes no
          fiduciary duties.
        </MediumBody>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">
            Use of Float or Corporate Settlement Accounts
          </span>{' '}
          SaaS clients integrating Bitvora’s Services may use float or corporate settlement accounts
          provided that they:
        </MediumBody>

        <ul className="px-6">
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Use only unencumbered funds under their control
            </MediumSmallText>
          </li>
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Maintain segregation of customer funds
            </MediumSmallText>
          </li>
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Provide evidence of such segregation upon request
            </MediumSmallText>
          </li>
        </ul>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Merchant Use Clause</span> Merchants using
          Bitvora Commerce must:
        </MediumBody>

        <ul className="px-6">
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Conduct KYC on end-users as legally required
            </MediumSmallText>
          </li>
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Implement fraud prevention controls
            </MediumSmallText>
          </li>
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Maintain clear refund/dispute resolution policies
              Bitvora is not a third-party mediator and disclaims all liability related to
              merchant-end user disputes. All Bitcoin transactions are irreversible.
            </MediumSmallText>
          </li>
        </ul>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Service Limitations</span> Bitvora Inc. is not
          a regulated custodian. Any funds deposited are solely to facilitate transactions. Users
          are considered unsecured creditors and accept all associated risks. Funds must not be
          stored beyond what is necessary to complete immediate transfers.
        </MediumBody>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">
            Prohibited Use of Third-Party or Customer Funds
          </span>{' '}
          Users may not use third-party funds unless operating with float or settlement accounts in
          full compliance with fund segregation obligations.
        </MediumBody>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Transaction Limits</span> Users may not
          send/receive above contractual or published free-tier limits.
        </MediumBody>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Transaction Finality</span> Transactions are
          final and cannot be reversed. Bitvora is not liable for losses due to user error.
        </MediumBody>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Pricing and Payment</span> Bitvora may change
          pricing without prior notice. All fees are non- refundable unless stated otherwise.
        </MediumBody>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Taxes</span> Clients are responsible for all
          applicable taxes.
        </MediumBody>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Intellectual Property and Licensing</span> The
          Bitvora Commerce software and related self- hosted tools are licensed under the MIT
          License. This means you are free to use, copy, modify, merge, publish, and distribute
          copies of the Software, subject to the following conditions:
        </MediumBody>

        <ul className="px-6">
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> The original copyright notice and permission notice
              shall be included in all copies or substantial portions of the Software.
            </MediumSmallText>
          </li>
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> The Software is provided &quot;as-is,&quot; without
              warranty of any kind.
            </MediumSmallText>
          </li>
        </ul>

        <MediumBody className="text-light-800">
          While commercial resale or offering the software as a service is not permitted, all
          intellectual property rights not covered by the MIT License are retained by Bitvora Inc.
        </MediumBody>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">API Licensing</span> Clients may modify/extend
          API functionality for internal use. Reverse engineering, scraping, and unauthorized
          duplication are prohibited.
        </MediumBody>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Confidentiality</span> Users must protect
          Bitvora’s confidential information during and after engagement.
        </MediumBody>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Data Protection and Privacy</span> Personal
          data is processed per our Privacy Policy. Bitvora uses consent, contract, legal
          obligation, and legitimate interest as legal bases for data processing.
        </MediumBody>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Data Processing Agreement (DPA)</span> Business
          clients acting as data controllers must execute a DPA. Bitvora acts as a processor when
          handling their user data.
        </MediumBody>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Warranties and Disclaimers</span> Services are
          provided &quot;as-is.&quot; Bitvora disclaims all warranties.
        </MediumBody>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Limitation of Liability</span> Bitvora is not
          liable for indirect or consequential damages.
        </MediumBody>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Indemnification</span> Clients indemnify
          Bitvora against third-party claims.
        </MediumBody>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Termination and Suspension</span> Bitvora may
          suspend/terminate accounts for suspicious activity or violations. Users may terminate at
          any time by notice.
        </MediumBody>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Effect of Termination</span> All rights cease
          at termination. Bitvora may delete data.
        </MediumBody>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Dispute Resolution</span> All disputes must be
          resolved in Ontario, Canada.
        </MediumBody>

        <ul className="px-6">
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> A 30-day informal resolution period applies before
              arbitration.
            </MediumSmallText>
          </li>
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Users waive jurisdiction elsewhere and class actions.
            </MediumSmallText>
          </li>
        </ul>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Miscellaneous</span> These Terms, along with
          the Privacy Policy and incorporated references, are the full agreement.
        </MediumBody>
      </div>
    </div>
  );
}
