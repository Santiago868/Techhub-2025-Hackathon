import { Form } from "react-router";
import { cn } from "../lib/utils"
import { Button } from "../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import { Input } from "../components/ui/input"
import backgroundImg from "../../public/imgs/loginBackground.jpg";



export default function Login() {
    return (
    <div className={cn("flex justify-center items-center min-h-screen bg-cover bg-center -mt-4",)}  style={{ backgroundImage: `url(${backgroundImg})` }}>
      <Card className="min-w-80 h-full flex flex-col justify-end mx-auto p-4 pt-34 border-2 border-gray-300 rounded-xl bg-white/30 backdrop-blur-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-white font-bold text-3xl">Login</CardTitle>
          <CardDescription className="text-white">
            Welcome back! Please enter your username and password to pick up where you left off.
          </CardDescription>
        </CardHeader>
        <CardContent>
        <Form action="/login" method="post">
            <div className="flex flex-col gap-6">
            <div className="grid gap-3">
                <Input
                  id="username"
                  name="username"
                  type="string"
                  placeholder="username"
                  required
                  
                />
              </div>
            <div className="grid gap-3">
                <div className="flex items-center">
                </div>
                <Input id="password" name="password" type="password" required placeholder="password" />
                <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-white"
                  >
                    Forgot your password?
                  </a>
              </div>
            <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full bg-gradient-to-l from-[#91B882] from-[16.666%] to-[#5D8D55]  hover:bg-[#A3C695]">
                  Login
                </Button>
            </div>
            </div>
        </Form>
        </CardContent>
    </Card>
    </div>
    );
}