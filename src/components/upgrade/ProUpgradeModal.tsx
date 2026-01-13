import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Crown, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  AlertCircle,
  Loader2,
  ArrowRight,
  Zap
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ProUpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: string;
}

const proFeatures = [
  '50+ Premium Templates',
  'No Watermark on PDFs',
  'Cover Letter Builder',
  'Advanced ATS Analysis',
  'Priority Support',
  'All Future Updates',
];

export function ProUpgradeModal({ open, onOpenChange, feature }: ProUpgradeModalProps) {
  const { activateLicense, isPro } = useAppStore();
  const [licenseKey, setLicenseKey] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showLicenseInput, setShowLicenseInput] = useState(false);

  const handleActivate = async () => {
    if (!licenseKey.trim()) {
      setError('Please enter a license key');
      return;
    }

    setIsActivating(true);
    setError(null);

    // Simulate network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    const isValid = activateLicense(licenseKey);
    
    if (isValid) {
      setSuccess(true);
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
        setLicenseKey('');
        setShowLicenseInput(false);
      }, 1500);
    } else {
      setError('Invalid license key. Please check and try again.');
    }
    
    setIsActivating(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    setError(null);
    setLicenseKey('');
    setShowLicenseInput(false);
  };

  if (success) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="h-20 w-20 rounded-full gradient-bg flex items-center justify-center mb-6"
            >
              <Crown className="h-10 w-10 text-primary-foreground" />
            </motion.div>
            <h2 className="font-display text-2xl font-bold mb-2">Welcome to Pro!</h2>
            <p className="text-muted-foreground text-center">
              All premium features are now unlocked.
            </p>
          </motion.div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl gradient-bg flex items-center justify-center">
              <Crown className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle className="font-display text-xl">Upgrade to Pro</DialogTitle>
              <DialogDescription>
                {feature 
                  ? `Unlock ${feature} and all premium features`
                  : 'Get access to all premium features'
                }
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Pricing */}
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4">
              <Zap className="h-3 w-3" />
              Lifetime Access
            </div>
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="text-4xl font-bold">$19</span>
              <span className="text-muted-foreground">/lifetime</span>
            </div>
            <p className="text-sm text-muted-foreground">One-time payment, forever access</p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3">
            {proFeatures.map((feat) => (
              <div key={feat} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-score-excellent shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          {/* License Key Input */}
          <AnimatePresence mode="wait">
            {showLicenseInput ? (
              <motion.div
                key="license-input"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="license">License Key</Label>
                  <Input
                    id="license"
                    placeholder="PRO-XXXX-XXXX-XXXX"
                    value={licenseKey}
                    onChange={(e) => {
                      setLicenseKey(e.target.value.toUpperCase());
                      setError(null);
                    }}
                    className={cn(error && "border-destructive")}
                  />
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-destructive flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" />
                      {error}
                    </motion.p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowLicenseInput(false)}
                  >
                    Back
                  </Button>
                  <Button
                    variant="hero"
                    className="flex-1"
                    onClick={handleActivate}
                    disabled={isActivating}
                  >
                    {isActivating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Activating...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Activate
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  Valid keys start with PRO-, RESUME-, or ATS- and are at least 12 characters.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="purchase-options"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <Button variant="hero" size="lg" className="w-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Purchase Pro - $19
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full"
                  onClick={() => setShowLicenseInput(true)}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  I have a license key
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-6 pt-2 border-t border-border">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Secure Payment
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Instant Access
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5" />
              30-Day Guarantee
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
