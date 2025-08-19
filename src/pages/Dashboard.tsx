import { useEffect, useMemo, useState } from "react";
import { Search, Plus, Filter, Shield, Eye, Copy, Edit, Trash2, Globe, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import PasswordGenerator from "@/components/PasswordGenerator";
import PasswordForm, { PasswordFormValues } from "@/components/PasswordForm";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

interface PasswordDoc {
  _id: string;
  website: string;
  username: string;
  encryptedPassword: string;
  category?: string;
  updatedAt: string;
}

const Dashboard = () => {
  const { token } = useAuth();
  const [passwords, setPasswords] = useState<PasswordDoc[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, string>>({});
  const [showGenerator, setShowGenerator] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PasswordDoc | null>(null);
  const { toast } = useToast();

  const categories = ["All", "Work", "Personal", "Social", "Banking", "Entertainment"];
  
  const filteredPasswords = useMemo(() => passwords.filter(password => {
    const matchesSearch = password.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         password.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || password.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }), [passwords, searchTerm, selectedCategory]);

  const showPassword = async (id: string) => {
    try {
      const res = await apiFetch<{ password: string }>(`/passwords/${id}/decrypt`, { token });
      setVisiblePasswords(prev => ({ ...prev, [id]: res.password }));
      setTimeout(() => setVisiblePasswords(prev => { const copy = { ...prev }; delete copy[id]; return copy; }), 5000);
    } catch (e: any) {
      toast({ title: 'Failed to decrypt', description: e?.message || 'Error', variant: 'destructive' });
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: `${type} has been copied successfully.`,
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const getStrengthColor = (pwd: string) => {
    const lengthScore = pwd.length >= 12 ? 2 : pwd.length >= 8 ? 1 : 0;
    const variety = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].reduce((s, r) => s + (r.test(pwd) ? 1 : 0), 0);
    const score = lengthScore + variety;
    if (score >= 5) return { cls: "bg-primary text-primary-foreground", label: 'strong' };
    if (score >= 3) return { cls: "bg-warning text-warning-foreground", label: 'medium' };
    return { cls: "bg-destructive text-destructive-foreground", label: 'weak' };
  };

  const loadPasswords = async () => {
    try {
      const items = await apiFetch<PasswordDoc[]>(`/passwords`, { token });
      setPasswords(items);
    } catch (e: any) {
      toast({ title: 'Failed to load passwords', description: e?.message || 'Error', variant: 'destructive' });
    }
  };

  useEffect(() => { loadPasswords(); }, []);

  const handleCreate = async (values: PasswordFormValues) => {
    await apiFetch<PasswordDoc>(`/passwords`, { method: 'POST', token, body: JSON.stringify(values) });
    setShowForm(false);
    await loadPasswords();
    toast({ title: 'Password saved' });
  };

  const handleUpdate = async (id: string, values: PasswordFormValues) => {
    await apiFetch<PasswordDoc>(`/passwords/${id}`, { method: 'PUT', token, body: JSON.stringify(values) });
    setEditing(null);
    setShowForm(false);
    await loadPasswords();
    toast({ title: 'Password updated' });
  };

  const handleDelete = async (id: string) => {
    await apiFetch(`/passwords/${id}`, { method: 'DELETE', token });
    await loadPasswords();
    toast({ title: 'Password deleted' });
  };

  return (
    <div className="min-h-screen bg-gradient-vault">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg shadow-secure overflow-hidden">
              <img src="/logo.svg" alt="logo" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Password Vault</h1>
              <p className="text-muted-foreground">Manage your encrypted credentials</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setShowGenerator(true)}
              variant="outline"
              className="border-primary/20 hover:bg-primary/5"
            >
              <Plus className="w-4 h-4 mr-2" />
              Generate Password
            </Button>
            <Button className="bg-gradient-primary hover:opacity-90 shadow-secure" onClick={() => { setEditing(null); setShowForm(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Password
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="shadow-vault border-border/50 animate-slide-up">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search passwords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Filter className="w-4 h-4 mr-2" />
                    {selectedCategory}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card border-border/50">
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Password Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-slide-up">
          <Card className="shadow-vault border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Passwords</p>
                  <p className="text-2xl font-bold">{passwords.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-vault border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Strong Passwords</p>
                  <p className="text-2xl font-bold text-primary">
                    {passwords.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-vault border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Weak Passwords</p>
                  <p className="text-2xl font-bold text-warning">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-vault border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold">{categories.length - 1}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Password List */}
        <div className="space-y-4 animate-slide-up">
          {filteredPasswords.map((password) => (
            <Card key={password._id} className="shadow-vault border-border/50 hover:bg-vault-hover transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{password.website}</CardTitle>
                      <CardDescription>{password.username}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{password.category || 'Personal'}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="font-mono text-sm bg-muted/50 px-3 py-1 rounded">
                      {visiblePasswords[password._id] ? visiblePasswords[password._id] : '••••••••'}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => showPassword(password._id)}
                      className="hover:bg-vault-hover"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (visiblePasswords[password._id]) copyToClipboard(visiblePasswords[password._id], "Password");
                        else showPassword(password._id);
                      }}
                      className="hover:bg-vault-hover"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="hover:bg-vault-hover" onClick={() => { setEditing(password); setShowForm(true); }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(password._id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Last updated: {new Date(password.updatedAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPasswords.length === 0 && (
          <Card className="shadow-vault border-border/50 animate-fade-in">
            <CardContent className="p-8 text-center">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No passwords found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "Try adjusting your search terms" : "Start by adding your first password"}
              </p>
              <Button className="bg-gradient-primary hover:opacity-90 shadow-secure" onClick={() => { setEditing(null); setShowForm(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Password
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Password Generator Modal */}
      {showGenerator && (
        <PasswordGenerator onClose={() => setShowGenerator(false)} />
      )}

      {showForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-lg">
            <PasswordForm
              initialValues={editing ? { website: editing.website, username: editing.username, category: editing.category } : undefined}
              submitLabel={editing ? 'Update' : 'Save'}
              onCancel={() => { setShowForm(false); setEditing(null); }}
              onSubmit={async (values) => {
                if (editing) await handleUpdate(editing._id, values);
                else await handleCreate(values);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;