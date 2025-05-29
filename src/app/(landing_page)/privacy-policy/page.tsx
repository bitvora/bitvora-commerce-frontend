'use client';

import { Link } from '@/components/Links';
import { MediumBody, MediumSmallText, SemiboldHeader3 } from '@/components/Text';

export default function Page() {
  return (
    <div className="w-full flex flex-col items-center gap-8 pt-[150px] container mx-auto px-3">
      <SemiboldHeader3>Privacy Policy</SemiboldHeader3>

      <div className="flex flex-col gap-8">
        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Introduction</span> Bitvora Inc.
          (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to
          protecting user privacy. This Privacy Policy explains how we collect, use, disclose, and
          protect personal data.
        </MediumBody>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Information We Collect</span>
        </MediumBody>

        <ul className="px-6">
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Contact Information: name, email, phone, address
            </MediumSmallText>
          </li>
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Identity Verification: ID, date of birth, compliance
              documents
            </MediumSmallText>
          </li>
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Account: usernames, passwords
            </MediumSmallText>
          </li>
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Payment: billing, method, transaction history
            </MediumSmallText>
          </li>
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Device & Usage: IP, browser, OS, pages visited,
              geolocation
            </MediumSmallText>
          </li>
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Third-Party Sources: public records, social media,
              integrations
            </MediumSmallText>
          </li>
        </ul>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Legal Basis for Processing</span> We process
          data under:
        </MediumBody>

        <ul className="px-6">
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Consent
            </MediumSmallText>
          </li>
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Contractual necessity
            </MediumSmallText>
          </li>
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Legal obligations (e.g., FINTRAC)
            </MediumSmallText>
          </li>
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Legitimate interest (e.g., security)
            </MediumSmallText>
          </li>
        </ul>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">How We Use Your Information</span>
        </MediumBody>

        <ul className="px-6">
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Account management and support
            </MediumSmallText>
          </li>
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Payment processing documents
            </MediumSmallText>
          </li>
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Regulatory compliance
            </MediumSmallText>
          </li>
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Fraud and abuse prevention
            </MediumSmallText>
          </li>
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Marketing (with consent)
            </MediumSmallText>
          </li>
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Internal analytics
            </MediumSmallText>
          </li>
        </ul>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Data Processing Agreement (DPA)</span> We act
          as a processor for business clients under contract. Clients must enter a DPA to ensure
          compliance with PIPEDA and GDPR (if applicable).
        </MediumBody>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Sharing of Information</span>
        </MediumBody>

        <ul className="px-6">
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Service providers (e.g., ID checks, hosting)
            </MediumSmallText>
          </li>
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Regulators (e.g., FINTRAC)
            </MediumSmallText>
          </li>
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Legal authorities (e.g., subpoenas)
            </MediumSmallText>
          </li>
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Business transfers
            </MediumSmallText>
          </li>
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> With user consent
            </MediumSmallText>
          </li>
        </ul>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Risk Disclosure</span>
        </MediumBody>

        <ul className="px-6">
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Bitcoin is volatile and high risk
            </MediumSmallText>
          </li>
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Total loss of funds is possible
            </MediumSmallText>
          </li>
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Transactions are final and irreversible
            </MediumSmallText>
          </li>
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Bitvora may freeze funds for AML reasons{' '}
              <span className="font-bold text-light-900">
                only if Bitvora’s wallet is used—this
              </span>{' '}
              does not apply to self-hosted wallets
            </MediumSmallText>
          </li>
        </ul>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Data Retention</span> Personal data is kept as
          required by law or business purposes. Data is securely deleted once no longer needed.
        </MediumBody>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Your Rights</span>
        </MediumBody>

        <ul className="px-6">
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Access and correct information
            </MediumSmallText>
          </li>
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Request portability
            </MediumSmallText>
          </li>
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Request erasure (where legal)
            </MediumSmallText>
          </li>
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Restrict or object to processing
            </MediumSmallText>
          </li>
        </ul>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Data Security</span>
        </MediumBody>

        <ul className="px-6">
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Encryption in transit and at rest
            </MediumSmallText>
          </li>
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Access controls
            </MediumSmallText>
          </li>
          <li className="text-light-800">
            <MediumSmallText>
              <span className="pr-2">￿</span> Regular audits
            </MediumSmallText>
          </li>
        </ul>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">International Transfers</span> Bitvora is based
          in Canada and may process data abroad. We ensure adequate protection through standard
          safeguards.
        </MediumBody>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Children&apos;s Privacy</span> Services are not
          intended for individuals under 18. We do not knowingly collect data from minors.
        </MediumBody>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Third-Party Links</span> External sites are not
          covered by our policy.
        </MediumBody>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Changes to Policy</span> We may revise this
          Policy and notify users accordingly.
        </MediumBody>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Contact</span> Email:{' '}
          <Link href="mailto:privacy@bitvora.com" target="_blank" referrerPolicy="origin">
            <span className="font-semibold text-light-900">privacy@bitvora.com</span>
          </Link>
        </MediumBody>

        <MediumBody className="text-light-800">
          <span className="font-bold text-light-900">Governing Law</span> Ontario law governs this
          Policy. Disputes follow Terms of Service procedures.
        </MediumBody>
      </div>
    </div>
  );
}
