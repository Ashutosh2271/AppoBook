import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  Clock, 
  Users, 
  ArrowRight 
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SignUp from '../components/auth/Authentication';
import Login from '@/components/auth/Login';
import { useAuth } from '@/context/Context';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const {currentUser} = useAuth()
  const navigate = useNavigate()

  const features = [
    {
      icon: Calendar,
      title: "Easy Scheduling",
      description: "Book appointments with just a few clicks. Choose your preferred date and time seamlessly."
    },
    {
      icon: Users,
      title: "Lecturer Connectivity",
      description: "Connect directly with lecturers and manage your academic consultations effortlessly."
    },
    {
      icon: Clock,
      title: "Time Management",
      description: "Reduce waiting times and optimize your scheduling with our intelligent booking system."
    }
  ];

  const handelNavigate = ()=>{
     if(currentUser.role =="teacher"){
       navigate("/teacherdash")
     } else if(currentUser.role =="student"){
      navigate("/studentdash")
     }     
     else{
       navigate("/adminpanel")
     }
  }

  const handleLogin = () => {
    // Placeholder for login logic
    console.log("Login initiated");
    setIsLoginDialogOpen(false);
  };

  const handleRegister = () => {
    // Placeholder for registration logic
    console.log("Registration initiated");
    setIsRegisterDialogOpen(false);
  };

  return (
    <div className="min-h-screen ">
      {/* Navigation */}
     

      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-5xl font-extrabold text-blue-900 mb-6">
          Streamline Your Academic Appointments
        </h2>
        <p className="text-xl text-blue-700 mb-8 max-w-2xl mx-auto">
          Simplify scheduling between students and lecturers. Book, manage, and track your appointments with ease.
        </p>
        <div className="space-x-4">
         {currentUser? <Button onClick={handelNavigate}>Go To Dashboard</Button>: <Button 
            size="lg" 
            className="text-lg"
            onClick={() => setIsRegisterDialogOpen(true)}
          >
            Get Started <ArrowRight className="ml-2" />
          </Button>}
          <Button variant="outline" size="lg" className="text-lg">
            Learn More
          </Button>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <feature.icon className="text-blue-600 mb-4" size={48} />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

     

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-blue-600 text-white p-12 rounded-2xl">
          <h3 className="text-4xl font-bold mb-6">Ready to Simplify Your Scheduling?</h3>
          <p className="text-xl mb-8">
            Join thousands of students and lecturers who have transformed their appointment management.
          </p>
          <div className="space-x-4">
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-blue-600"
              onClick={() => setIsRegisterDialogOpen(true)}
            >
              Create Free Account
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 text-center">
        <div className="flex justify-center space-x-6 mb-6">
          <span className="text-blue-600 hover:text-blue-800 cursor-pointer">About</span>
          <span className="text-blue-600 hover:text-blue-800 cursor-pointer">Contact</span>
          <span className="text-blue-600 hover:text-blue-800 cursor-pointer">Privacy Policy</span>
        </div>
        <p className="text-muted-foreground">
          © 2024 AppoBook. All rights reserved.
        </p>
      
      </footer>
      
    </div>
  );
};

export default LandingPage  