import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SkeletonCard } from '@/components/ui/skeleton-card';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-screen';
import { Save, FileText, Shield, ScrollText } from 'lucide-react';
import type { LegalContent } from '@/services/api';

// Mock content
const mockLegalContent: Record<string, LegalContent> = {
  'privacy-policy': {
    title: 'Privacy Policy',
    content: '# Privacy Policy\n\nLast updated: February 2025\n\n## Introduction\n\nEarnvra is committed to protecting your privacy...',
    updated_at: '2025-02-01T00:00:00Z',
  },
  'terms': {
    title: 'Terms of Service',
    content: '# Terms of Service\n\nLast updated: February 2025\n\n## Acceptance of Terms\n\nBy accessing Earnvra, you agree...',
    updated_at: '2025-02-01T00:00:00Z',
  },
};

const legalPages = [
  { slug: 'privacy-policy', title: 'Privacy Policy', icon: Shield },
  { slug: 'terms', title: 'Terms of Service', icon: ScrollText },
];

export function AdminLegalPages() {
  const [content, setContent] = useState<Record<string, LegalContent>>({});
  const [selectedPage, setSelectedPage] = useState<string>('privacy-policy');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadContent = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setContent(mockLegalContent);
      setIsLoading(false);
    };
    loadContent();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      title: 'Content saved',
      description: `${content[selectedPage]?.title} has been updated.`,
    });
    setIsSaving(false);
  };

  const updateContent = (slug: string, newContent: string) => {
    setContent((prev) => ({
      ...prev,
      [slug]: { ...prev[slug], content: newContent, updated_at: new Date().toISOString() },
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Legal Pages" />
        <SkeletonCard lines={8} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Legal Pages"
        description="Edit privacy policy and terms of service"
      >
        <Button variant="gradient" onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <LoadingSpinner size="sm" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </PageHeader>

      {/* Page Selector */}
      <div className="flex gap-2">
        {legalPages.map((page) => {
          const Icon = page.icon;
          const isActive = selectedPage === page.slug;
          return (
            <Button
              key={page.slug}
              variant={isActive ? 'default' : 'outline'}
              onClick={() => setSelectedPage(page.slug)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {page.title}
            </Button>
          );
        })}
      </div>

      {/* Editor */}
      <motion.div
        key={selectedPage}
        className="rounded-xl border bg-card p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">{content[selectedPage]?.title}</h2>
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date(content[selectedPage]?.updated_at || '').toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <Textarea
          value={content[selectedPage]?.content || ''}
          onChange={(e) => updateContent(selectedPage, e.target.value)}
          className="min-h-[400px] font-mono text-sm"
          placeholder="Enter content in Markdown format..."
        />

        <p className="mt-2 text-xs text-muted-foreground">
          Supports Markdown formatting. Use # for headings, ** for bold, etc.
        </p>
      </motion.div>
    </div>
  );
}
