import { useState, useEffect } from "react";
import { X, RefreshCw, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface PasswordGeneratorProps {
  onClose: () => void;
}

const PasswordGenerator = ({ onClose }: PasswordGeneratorProps) => {
  const [length, setLength] = useState([16]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generatePassword = () => {
    let charset = "";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    const similarChars = "il1Lo0O";

    if (includeLowercase) charset += lowercase;
    if (includeUppercase) charset += uppercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    if (excludeSimilar) {
      charset = charset.split('').filter(char => !similarChars.includes(char)).join('');
    }

    if (charset === "") {
      toast({
        title: "No character types selected",
        description: "Please select at least one character type.",
        variant: "destructive",
      });
      return;
    }

    let generatedPassword = "";
    for (let i = 0; i < length[0]; i++) {
      generatedPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    setPassword(generatedPassword);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      toast({
        title: "Password copied",
        description: "Generated password has been copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy password to clipboard.",
        variant: "destructive",
      });
    }
  };

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strengthScore = getPasswordStrength(password);
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColors = ["bg-destructive", "bg-destructive", "bg-warning", "bg-blue-500", "bg-primary", "bg-primary"];

  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeSimilar]);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-md shadow-vault border-border/50 animate-scale-in">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle>Password Generator</CardTitle>
            <CardDescription>Create a secure password with custom options</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-vault-hover"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Generated Password Display */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Generated Password</Label>
              {password && (
                <Badge className={strengthColors[Math.min(strengthScore, 5)]}>
                  {strengthLabels[Math.min(strengthScore, 5)]}
                </Badge>
              )}
            </div>
            <div className="relative">
              <div className="p-3 bg-muted/50 rounded-lg font-mono text-sm break-all border min-h-[3rem] flex items-center">
                {password || "Click generate to create password"}
              </div>
              <div className="absolute right-2 top-2 flex space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={generatePassword}
                  className="h-8 w-8 p-0 hover:bg-background/50"
                >
                  <RefreshCw className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copyToClipboard}
                  disabled={!password}
                  className="h-8 w-8 p-0 hover:bg-background/50"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-primary" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Password Length */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Password Length</Label>
              <span className="text-sm font-medium bg-muted px-2 py-1 rounded">
                {length[0]} characters
              </span>
            </div>
            <Slider
              value={length}
              onValueChange={setLength}
              max={50}
              min={4}
              step={1}
              className="w-full"
            />
          </div>

          {/* Character Options */}
          <div className="space-y-4">
            <Label>Character Types</Label>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="uppercase" className="text-sm font-normal">
                Uppercase Letters (A-Z)
              </Label>
              <Switch
                id="uppercase"
                checked={includeUppercase}
                onCheckedChange={setIncludeUppercase}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="lowercase" className="text-sm font-normal">
                Lowercase Letters (a-z)
              </Label>
              <Switch
                id="lowercase"
                checked={includeLowercase}
                onCheckedChange={setIncludeLowercase}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="numbers" className="text-sm font-normal">
                Numbers (0-9)
              </Label>
              <Switch
                id="numbers"
                checked={includeNumbers}
                onCheckedChange={setIncludeNumbers}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="symbols" className="text-sm font-normal">
                Symbols (!@#$%^&*)
              </Label>
              <Switch
                id="symbols"
                checked={includeSymbols}
                onCheckedChange={setIncludeSymbols}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="exclude-similar" className="text-sm font-normal">
                Exclude Similar Characters
              </Label>
              <Switch
                id="exclude-similar"
                checked={excludeSimilar}
                onCheckedChange={setExcludeSimilar}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={generatePassword}
              className="flex-1 bg-gradient-primary hover:opacity-90 shadow-secure"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate New
            </Button>
            <Button
              onClick={copyToClipboard}
              variant="outline"
              disabled={!password}
              className="flex-1"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordGenerator;