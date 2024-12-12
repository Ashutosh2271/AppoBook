import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogIn } from 'lucide-react';
import Login from './Login';
import SignUpForm from './SignUp';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('signUp');

 
  return (
    <div className="flex items-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default" className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Get Started
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
        <Tabs defaultValue="signUp" className="w-full">
  {/* Tab Triggers */}
  <TabsList className="grid w-full grid-cols-2 mb-4">
    <TabsTrigger value="signUp" className="data-[state=active]:font-semibold">
      Sign Up
    </TabsTrigger>
    <TabsTrigger value="signIn" className="data-[state=active]:font-semibold">
      Sign In
    </TabsTrigger>
  </TabsList>

  {/* Tab Contents */}
  <TabsContent value="signUp" className="mt-0 border-none">
    <div className="space-y-4 py-2 pb-4">
      <div className="space-y-2">
        <SignUpForm />
      </div>
    </div>
  </TabsContent>
  
  <TabsContent value="signIn" className="mt-0 border-none">
    <div className="space-y-4 py-2 pb-4">
      <div className="space-y-2">
        <Login />
      </div>
    </div>
  </TabsContent>
</Tabs>

        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Auth;