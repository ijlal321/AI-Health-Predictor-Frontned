"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { sendOTP, verifyOTP, login, signUp, verifyJWT } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Mail, Lock, User } from "lucide-react"

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showOTPForm, setShowOTPForm] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    otp: "",
  })
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const result = await verifyJWT(token);
        if (result.success) {
          toast({
            title: "Session Verified",
            description: "Welcome back! Redirecting to your dashboard.",
          });
          router.push("/dashboard");
        } else {
          toast({
            variant: "destructive",
            title: "Session Expired",
            description: "Your session has expired. Please log in again.",
          });
          localStorage.removeItem("token");
        }
      }
    };

    checkToken();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e, isLogin) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let result;
      // try to log in
      if (isLogin) {
        result = await login(formData.email, formData.password);
      }
      else { // try to sign up
        result = await signUp(formData.username, formData.email, formData.password);
      } 
      // in case of any error while authenticating.
      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Action Failed. Please try again later.",
        })
        return;
      }

      // in case auth is successful, then ask user to input otp.
      setShowOTPForm(true)
      toast({
        title: "OTP Sent",
        description: "Please check your email for the verification code",
      })

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await verifyOTP(formData.email, formData.otp)

      if (result.success) {
        toast({
          title: "Success",
          description: "OTP verified successfully",
        })
        const token = result.token;

        // setting jwt token
        localStorage.setItem("token", token)
        // set user id in local storage
        const userId = result.userId;
        // setting jwt userId
        localStorage.setItem("userId", userId)
        router.push("/dashboard")


      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Invalid OTP",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (showOTPForm) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>Enter the verification code sent to {formData.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerifyOTP}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  name="otp"
                  placeholder="Enter OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => setShowOTPForm(false)} disabled={isLoading}>
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => handleSubmit(e, true)}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email-login">Email</Label>
                  <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-ring">
                    <Mail className="ml-2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email-login"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="border-0 focus-visible:ring-0"
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password-login">Password</Label>
                  <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-ring">
                    <Lock className="ml-2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password-login"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="border-0 focus-visible:ring-0"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Login"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="signup">
        <Card>
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>Enter your details to create a new account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => handleSubmit(e, false)}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-ring">
                    <User className="ml-2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="username"
                      name="username"
                      placeholder="johndoe"
                      value={formData.username}
                      onChange={handleChange}
                      className="border-0 focus-visible:ring-0"
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email-signup">Email</Label>
                  <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-ring">
                    <Mail className="ml-2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email-signup"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="border-0 focus-visible:ring-0"
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password-signup">Password</Label>
                  <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-ring">
                    <Lock className="ml-2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password-signup"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="border-0 focus-visible:ring-0"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Sign Up"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
