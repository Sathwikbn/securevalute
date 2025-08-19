import { Link } from "react-router-dom";
import { Shield, Lock, Eye, RefreshCw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const features = [
    {
      icon: Shield,
      title: "Military-Grade Encryption",
      description: "Your passwords are encrypted with AES-256 encryption before being stored securely."
    },
    {
      icon: Lock,
      title: "Zero-Knowledge Architecture",
      description: "Only you know your master password. We can't see your data even if we wanted to."
    },
    {
      icon: Eye,
      title: "Secure Password Sharing",
      description: "Share passwords safely with team members without exposing the actual credentials."
    },
    {
      icon: RefreshCw,
      title: "Smart Password Generator",
      description: "Generate strong, unique passwords with customizable length and complexity rules."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-vault">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-6">
            <img src="/logo.svg" alt="logo" className="w-24 h-24 object-contain rounded-2xl shadow-secure" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">SecureVault</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your personal encrypted password manager. Store, generate, and manage all your passwords 
            in one secure location with military-grade encryption.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              size="lg"
              className="bg-gradient-primary hover:opacity-90 shadow-secure text-lg px-8 py-3 animate-slide-up"
            >
              <Link to="/register">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8 py-3 border-primary/20 hover:bg-primary/5 animate-slide-up"
            >
              <Link to="/login">
                Sign In
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="shadow-vault border-border/50 hover:bg-vault-hover transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-secondary rounded-xl mb-3 mx-auto">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security Promise */}
        <Card className="shadow-vault border-border/50 max-w-4xl mx-auto animate-slide-up">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-2">Your Security is Our Priority</CardTitle>
            <CardDescription className="text-lg">
              We use industry-standard security practices to keep your data safe
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">End-to-End Encryption</h3>
              <p className="text-sm text-muted-foreground">
                Your data is encrypted on your device before it reaches our servers
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Zero Knowledge</h3>
              <p className="text-sm text-muted-foreground">
                We never have access to your master password or decrypted data
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <RefreshCw className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Regular Security Audits</h3>
              <p className="text-sm text-muted-foreground">
                Our security practices are regularly reviewed and updated
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center mt-16 animate-slide-up">
          <h2 className="text-3xl font-bold mb-4">Ready to Secure Your Digital Life?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust SecureVault to keep their passwords safe and secure.
          </p>
          <Button 
            asChild
            size="lg"
            className="bg-gradient-primary hover:opacity-90 shadow-secure text-lg px-8 py-3"
          >
            <Link to="/register">
              Create Your Secure Vault
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
