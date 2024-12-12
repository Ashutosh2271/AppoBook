import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/Context';
import { auth } from '@/firebase/firebase';
import { useNavigate } from 'react-router-dom';

const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("teacher");
  const [userName, setUserName] =useState("")
const navigate = useNavigate()
  const { handleRegister } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await handleRegister(email, password, role,userName);
      toast.success("User registered successfully!");
      setEmail("");
      setPassword("");
      setRole("student");
   if(role == "teacher"){
     navigate("/teacherForm")
   } else{
     navigate("/studentdash")
   }

    } catch (error) {
      toast.error(error.message || "An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, provider);
      toast.success(`Welcome, ${result.user.email}`);
    } catch (error) {
      toast.error(error.message || "Google login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-xs mx-auto">
      <CardHeader className="py-3">
        <CardTitle className="text-lg font-medium text-center">Signup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          variant="outline"
          className="w-full h-7 text-xs"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          Continue with Google
        </Button>

        <div className="relative py-1">
          <Separator />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-[10px] text-muted-foreground uppercase">
            or
          </span>
        </div>

        <form className="space-y-2" onSubmit={handleSubmit}>
        <div>
            <Label htmlFor="usernmae" className="text-xs">username</Label>
            <Input
              id="username"
              type="name"
              className="h-7 text-xs mt-0.5"
              placeholder="m@example.com"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-xs">Email</Label>
            <Input
              id="email"
              type="email"
              className="h-7 text-xs mt-0.5"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-xs">Password</Label>
              <Button variant="link" className="text-[10px] h-4 p-0">Forgot?</Button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="h-7 text-xs mt-0.5"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-xs p-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div>
            <Label htmlFor="role" className="text-xs">Role</Label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="h-7 text-xs mt-0.5 w-full border border-gray-300 rounded"
            >
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </div>
          <Button className="w-full h-7 text-xs" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignUpForm;
