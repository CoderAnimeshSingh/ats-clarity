import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Award, ExternalLink } from 'lucide-react';
import { useResumeStore } from '@/store/resumeStore';

export function CertificationsStep() {
  const { currentResume, addCertification, updateCertification, removeCertification } = useResumeStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newCertification, setNewCertification] = useState({
    name: '',
    issuer: '',
    date: '',
    expiryDate: '',
    credentialId: '',
    link: '',
  });

  if (!currentResume) return null;

  const handleAdd = () => {
    if (newCertification.name.trim() && newCertification.issuer.trim()) {
      addCertification(newCertification);
      setNewCertification({ name: '', issuer: '', date: '', expiryDate: '', credentialId: '', link: '' });
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Certifications</h2>
        <p className="text-muted-foreground">
          Add professional certifications that demonstrate your expertise.
        </p>
      </div>

      {/* Existing Certifications */}
      <div className="space-y-4">
        {currentResume.certifications.map((cert) => (
          <Card key={cert.id} className="relative group">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <Award className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <Label htmlFor={`cert-name-${cert.id}`}>Certification Name</Label>
                        <Input
                          id={`cert-name-${cert.id}`}
                          value={cert.name}
                          onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                          placeholder="AWS Solutions Architect"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`cert-issuer-${cert.id}`}>Issuing Organization</Label>
                        <Input
                          id={`cert-issuer-${cert.id}`}
                          value={cert.issuer}
                          onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                          placeholder="Amazon Web Services"
                        />
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <Label htmlFor={`cert-date-${cert.id}`}>Issue Date</Label>
                        <Input
                          id={`cert-date-${cert.id}`}
                          value={cert.date}
                          onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                          placeholder="Jan 2024"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`cert-expiry-${cert.id}`}>Expiry Date (Optional)</Label>
                        <Input
                          id={`cert-expiry-${cert.id}`}
                          value={cert.expiryDate || ''}
                          onChange={(e) => updateCertification(cert.id, { expiryDate: e.target.value })}
                          placeholder="Jan 2027"
                        />
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <Label htmlFor={`cert-id-${cert.id}`}>Credential ID (Optional)</Label>
                        <Input
                          id={`cert-id-${cert.id}`}
                          value={cert.credentialId || ''}
                          onChange={(e) => updateCertification(cert.id, { credentialId: e.target.value })}
                          placeholder="ABC123XYZ"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`cert-link-${cert.id}`}>Verification Link (Optional)</Label>
                        <Input
                          id={`cert-link-${cert.id}`}
                          value={cert.link || ''}
                          onChange={(e) => updateCertification(cert.id, { link: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => removeCertification(cert.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Certification */}
      {isAdding ? (
        <Card className="border-accent/50 bg-accent/5">
          <CardContent className="p-4 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="new-cert-name">Certification Name *</Label>
                <Input
                  id="new-cert-name"
                  value={newCertification.name}
                  onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
                  placeholder="AWS Solutions Architect"
                  autoFocus
                />
              </div>
              <div>
                <Label htmlFor="new-cert-issuer">Issuing Organization *</Label>
                <Input
                  id="new-cert-issuer"
                  value={newCertification.issuer}
                  onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })}
                  placeholder="Amazon Web Services"
                />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="new-cert-date">Issue Date</Label>
                <Input
                  id="new-cert-date"
                  value={newCertification.date}
                  onChange={(e) => setNewCertification({ ...newCertification, date: e.target.value })}
                  placeholder="Jan 2024"
                />
              </div>
              <div>
                <Label htmlFor="new-cert-expiry">Expiry Date (Optional)</Label>
                <Input
                  id="new-cert-expiry"
                  value={newCertification.expiryDate}
                  onChange={(e) => setNewCertification({ ...newCertification, expiryDate: e.target.value })}
                  placeholder="Jan 2027"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleAdd} size="sm">
                Add Certification
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button variant="outline" onClick={() => setIsAdding(true)} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Certification
        </Button>
      )}

      {/* Tips */}
      <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
        <h4 className="font-medium">Tips for Certifications:</h4>
        <ul className="list-disc list-inside text-muted-foreground space-y-1">
          <li>Include industry-recognized certifications relevant to your target role</li>
          <li>List the most recent or prestigious certifications first</li>
          <li>Include credential IDs for easy verification by recruiters</li>
          <li>Remove expired certifications unless they're highly relevant</li>
        </ul>
      </div>
    </div>
  );
}
