import { useResumeStore } from '@/store/resumeStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, MapPin, Linkedin, Globe, Briefcase } from 'lucide-react';

export function PersonalInfoStep() {
  const { currentResume, updatePersonalInfo, setResumeName } = useResumeStore();

  if (!currentResume) return null;

  const { personalInfo } = currentResume;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold mb-2">Personal Information</h2>
        <p className="text-muted-foreground">
          Let's start with your basic contact information.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="resumeName">Resume Name</Label>
          <Input
            id="resumeName"
            placeholder="e.g., Software Engineer Resume"
            value={currentResume.name}
            onChange={(e) => setResumeName(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              Full Name *
            </Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              value={personalInfo.fullName}
              onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2">
              <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
              Professional Title *
            </Label>
            <Input
              id="title"
              placeholder="Software Engineer"
              value={personalInfo.title}
              onChange={(e) => updatePersonalInfo({ title: e.target.value })}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={personalInfo.email}
              onChange={(e) => updatePersonalInfo({ email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              Phone *
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={personalInfo.phone}
              onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            Location *
          </Label>
          <Input
            id="location"
            placeholder="San Francisco, CA"
            value={personalInfo.location}
            onChange={(e) => updatePersonalInfo({ location: e.target.value })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="linkedIn" className="flex items-center gap-2">
              <Linkedin className="h-3.5 w-3.5 text-muted-foreground" />
              LinkedIn (optional)
            </Label>
            <Input
              id="linkedIn"
              placeholder="linkedin.com/in/johndoe"
              value={personalInfo.linkedIn || ''}
              onChange={(e) => updatePersonalInfo({ linkedIn: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="flex items-center gap-2">
              <Globe className="h-3.5 w-3.5 text-muted-foreground" />
              Website (optional)
            </Label>
            <Input
              id="website"
              placeholder="johndoe.com"
              value={personalInfo.website || ''}
              onChange={(e) => updatePersonalInfo({ website: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
