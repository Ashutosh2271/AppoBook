import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '@/firebase/firebase';
import { toast } from 'react-toastify';
import { getDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      setEmail("");
      setPassword("");

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const { role, username, name, department, phone } = userDoc.data();
        console.log("User role:", role);

        if (role === "admin") {
          toast.success("Welcome Admin!");
          navigate("/adminpanel");
        } else if (role === "teacher") {
          if (name && department && phone) {
            navigate("/teacherdash");
          } else {
            navigate("/teacherForm");
          }
        } else if (role === "student") {
          toast.success("Welcome Student!");
          navigate("/studentdash");
        } else {
          toast.error("Invalid user role. Please contact support.");
          navigate("/login");
        }
      } else {
        toast.error("No such user exists in the database.");
      }
    } catch (error) {
      console.error("Error signing in:", error.message);
      toast.error("Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      toast.success("Logged in with Google!");
      console.log("Google User:", result.user);
    } catch (error) {
      console.error("Google Login Error:", error.message);
      toast.error("Google login failed. Please try again.");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email to reset the password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent. Check your inbox!");
    } catch (error) {
      console.error("Error sending password reset email:", error.message);
      toast.error("Failed to send password reset email. Try again.");
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl font-medium text-center">Login</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          variant="outline"
          className="w-full py-1"
          onClick={handleGoogleLogin}
          type="button"
        >
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
  <div className="space-y-1">
    <Label htmlFor="email" className="text-sm">Email</Label>
    <Input
      id="email"
      type="email"
      placeholder="m@example.com"
      required
      className="h-8"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  </div>
  <div className="space-y-1">
    <div className="flex justify-between items-center">
      <Label htmlFor="password" className="text-sm">Password</Label>
      <Button 
        variant="link" 
        className="text-xs h-auto p-0"
        type="button" // Prevents form submission
        onClick={handleForgotPassword}
      >
        Forgot?
      </Button>
    </div>
    <Input
      id="password"
      type="password"
      required
      className="h-8"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
  </div>
  <Button
    className={`w-full h-8 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
    type="submit"
    disabled={isLoading}
  >
    {isLoading ? "Signing in..." : "Sign In"}
  </Button>
</form>


        <div className="text-xs text-muted-foreground text-center pt-1">
          Don't have an account?{" "}
          <Button variant="link" className="text-xs h-auto p-0" onClick={() => navigate("/signup")}>
            Sign up
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
