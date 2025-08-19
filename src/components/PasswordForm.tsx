import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export interface PasswordFormValues {
  website: string;
  username: string;
  password: string;
  category?: string;
}

export interface PasswordFormProps {
  initialValues?: Partial<PasswordFormValues>;
  onSubmit: (values: PasswordFormValues) => Promise<void> | void;
  onCancel: () => void;
  submitLabel?: string;
}

const PasswordForm = ({ initialValues, onSubmit, onCancel, submitLabel = 'Save' }: PasswordFormProps) => {
  const [website, setWebsite] = useState(initialValues?.website || '');
  const [username, setUsername] = useState(initialValues?.username || '');
  const [password, setPassword] = useState(initialValues?.password || '');
  const [category, setCategory] = useState(initialValues?.category || 'Personal');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setWebsite(initialValues?.website || '');
    setUsername(initialValues?.username || '');
    setPassword(initialValues?.password || '');
    setCategory(initialValues?.category || 'Personal');
  }, [initialValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ website, username, password, category });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-vault border-border/50">
      <CardHeader>
        <CardTitle>Credential</CardTitle>
        <CardDescription>Add or update a credential</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="website">Website/App</Label>
            <Input id="website" value={website} onChange={e => setWebsite(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" value={category} onChange={e => setCategory(e.target.value)} />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-gradient-primary hover:opacity-90">
              {submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PasswordForm;

