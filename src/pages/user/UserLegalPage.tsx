import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SkeletonCard } from '@/components/ui/skeleton-card';
import { ArrowLeft } from 'lucide-react';
import type { LegalContent } from '@/services/api';

// Mock content
const mockLegalContent: Record<string, LegalContent> = {
  'privacy-policy': {
    title: 'Privacy Policy',
    content: `
# Privacy Policy

Last updated: February 2025

## Introduction

Earnvra ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our rewards platform.

## Information We Collect

### Personal Information
- Email address
- Name
- Age and gender (optional)
- Country of residence

### Usage Information
- Offers completed
- Points earned and redeemed
- Device and browser information

## How We Use Your Information

- To provide and maintain our service
- To process your redemption requests
- To send you relevant offers
- To improve our platform

## Data Security

We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

## Your Rights

You have the right to:
- Access your personal data
- Request correction of your data
- Request deletion of your account
- Opt-out of marketing communications

## Contact Us

If you have questions about this Privacy Policy, please contact us through our Contact page.
    `,
    updated_at: '2025-02-01T00:00:00Z',
  },
  'terms': {
    title: 'Terms of Service',
    content: `
# Terms of Service

Last updated: February 2025

## Acceptance of Terms

By accessing or using Earnvra, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.

## Eligibility

You must be at least 13 years old to use Earnvra. By using our service, you represent that you meet this requirement.

## Account Responsibilities

- You are responsible for maintaining the security of your account
- You must provide accurate information
- One account per person is allowed

## Earning Points

- Points are earned by completing offers honestly
- Fraudulent activity will result in account termination
- We reserve the right to modify point values

## Redeeming Points

- Minimum redemption thresholds apply
- Redemptions are subject to verification
- Processing times may vary

## Prohibited Activities

- Creating multiple accounts
- Using automated tools or bots
- Providing false information
- Any form of fraud or abuse

## Termination

We reserve the right to terminate accounts that violate these terms without prior notice.

## Changes to Terms

We may update these terms at any time. Continued use of the service constitutes acceptance of updated terms.

## Contact

For questions about these terms, please contact us through our Contact page.
    `,
    updated_at: '2025-02-01T00:00:00Z',
  },
};

export function UserLegalPage() {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState<LegalContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setContent(mockLegalContent[slug || ''] || null);
      setIsLoading(false);
    };
    loadContent();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="container max-w-3xl py-8">
        <SkeletonCard lines={10} />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="container max-w-3xl py-8 text-center">
        <h1 className="text-2xl font-bold">Page Not Found</h1>
        <p className="mt-2 text-muted-foreground">The requested legal page could not be found.</p>
        <Link to="/user" className="mt-4 inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      className="container max-w-3xl py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Link to="/user" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div className="rounded-xl border bg-card p-8">
        <div className="prose prose-slate max-w-none dark:prose-invert">
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date(content.updated_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
          <div className="mt-6 whitespace-pre-wrap">{content.content}</div>
        </div>
      </div>
    </motion.div>
  );
}
