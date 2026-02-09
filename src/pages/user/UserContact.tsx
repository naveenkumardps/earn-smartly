import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-screen';
import { Mail, User, MessageSquare, Send } from 'lucide-react';

export function UserContact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: 'Message sent!',
      description: 'We\'ll get back to you as soon as possible.',
    });

    setFormData({ name: '', email: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contact Us"
        description="Have questions? We're here to help!"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Contact Form */}
        <motion.div
          className="rounded-xl border bg-card p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="mb-6 text-lg font-semibold">Send us a message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="min-h-[150px] pl-10"
                  placeholder="How can we help you?"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </motion.div>

        {/* Info Section */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="rounded-xl border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: 'How long do redemptions take?', a: 'Most redemptions are processed within 24-48 hours.' },
                { q: 'Why didn\'t I receive points?', a: 'Points are credited once offers are verified. This may take a few minutes.' },
                { q: 'How do referrals work?', a: 'Share your unique code. When someone signs up and completes an offer, you both earn bonus points!' },
              ].map((faq, index) => (
                <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                  <h4 className="font-medium">{faq.q}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl gradient-primary p-6 text-primary-foreground">
            <h3 className="font-semibold">Need immediate help?</h3>
            <p className="mt-2 text-sm opacity-80">
              Check out our help center for instant answers to common questions.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
