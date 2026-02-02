import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Sparkles, Shield, Zap, CheckCircle2, ArrowRight, Mail, Download, Database } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const features = [
  {
    icon: Shield,
    title: 'ATS-Optimized',
    description: 'Every template is designed to pass Applicant Tracking Systems with flying colors.',
  },
  {
    icon: Zap,
    title: 'Build in Minutes',
    description: 'Our step-by-step wizard guides you through creating a professional resume fast.',
  },
  {
    icon: Sparkles,
    title: 'Smart Suggestions',
    description: 'Get real-time feedback and keyword optimization tips as you write.',
  },
  {
    icon: FileText,
    title: 'Export to PDF',
    description: 'Download print-ready PDFs in A4 or US Letter format instantly.',
  },
  {
    icon: Mail,
    title: 'Cover Letters',
    description: 'Create matching cover letters with multiple tone options and templates.',
  },
  {
    icon: Database,
    title: 'Local Storage',
    description: 'Your data stays on your device. No account needed, 100% private.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
        <div className="container-wide section-padding">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">ResumeATS</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#templates" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Templates
              </a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Link to="/builder">
                <Button variant="hero" size="sm">Create Resume</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-hero pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container-wide section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm text-accent mb-6">
                <Sparkles className="h-4 w-4" />
                <span>100% Free • No Signup Required</span>
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            >
              Create ATS-Optimized
              <br />
              <span className="gradient-text">Resume & Cover Letter</span>
              <br />
              in 10 Minutes
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Build a professional resume that passes ATS systems and impresses recruiters. 
              Completely free. No watermarks. Your data stays on your device.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/builder">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  Create Resume
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/cover-letter/new">
                <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
                  Create Cover Letter
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-10 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-score-excellent" />
                <span>No signup</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-score-excellent" />
                <span>No watermarks</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-score-excellent" />
                <span>100% private</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-score-excellent" />
                <span>Free forever</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="container-wide section-padding">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Stand Out
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Professional tools designed to help you create a resume that gets you hired.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-accent/50 hover:shadow-elevated transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-xl gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section id="templates" className="py-20 md:py-32 bg-surface-2">
        <div className="container-wide section-padding">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              17+ ATS-Friendly Templates
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Clean, minimal templates designed to pass any Applicant Tracking System. All free!
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {['Modern Clean', 'Classic Professional', 'Minimal Simple', 'Executive Bold'].map((template, index) => (
              <motion.div
                key={template}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative aspect-[3/4] rounded-xl bg-card border border-border overflow-hidden hover:shadow-hero hover:scale-[1.02] transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4/5 space-y-3 p-4">
                    <div className="h-3 w-3/4 bg-muted rounded" />
                    <div className="h-2 w-full bg-muted rounded" />
                    <div className="h-2 w-2/3 bg-muted rounded" />
                    <div className="h-6" />
                    <div className="h-2 w-1/2 bg-accent/30 rounded" />
                    <div className="h-2 w-full bg-muted rounded" />
                    <div className="h-2 w-4/5 bg-muted rounded" />
                    <div className="h-2 w-full bg-muted rounded" />
                    <div className="h-6" />
                    <div className="h-2 w-1/2 bg-accent/30 rounded" />
                    <div className="h-2 w-full bg-muted rounded" />
                    <div className="h-2 w-3/4 bg-muted rounded" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-primary-foreground font-medium text-sm">{template}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/builder">
              <Button variant="hero" size="lg">
                Browse All Templates
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-32">
        <div className="container-wide section-padding">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Create Your Resume in 3 Steps
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our guided wizard makes it easy to build a professional resume.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: '1', title: 'Fill in Your Details', description: 'Enter your personal info, experience, education, and skills in our easy-to-use form.' },
              { step: '2', title: 'Get ATS Score', description: 'See your real-time ATS score and get smart suggestions to improve your resume.' },
              { step: '3', title: 'Download PDF', description: 'Export your professional, ATS-optimized resume as a PDF. No watermarks!' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="h-16 w-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 gradient-bg">
        <div className="container-narrow section-padding text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of job seekers who've successfully used our free resume builder.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/builder">
              <Button variant="secondary" size="xl">
                <FileText className="h-5 w-5 mr-2" />
                Create Resume
              </Button>
            </Link>
            <Link to="/cover-letter/new">
              <Button variant="outline" size="xl" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Mail className="h-5 w-5 mr-2" />
                Create Cover Letter
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-surface-2 border-t border-border">
        <div className="container-wide section-padding">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">ResumeATS</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-sm text-muted-foreground">
              <span>Free ATS Resume & Cover Letter Builder</span>
              <span className="hidden md:inline">•</span>
              <span>© {new Date().getFullYear()} ResumeATS. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
