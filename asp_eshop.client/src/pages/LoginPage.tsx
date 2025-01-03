import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/stores/authStore"
import { authApi } from "@/api/auth"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormField, FormLabel, FormMessage, FormControl, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const loginSchema = z.object({
    username: z.string()
        .min(1, "Username is required"),
    password: z.string()
        .min(1, "Password is required")
})

type LoginSchema = z.infer<typeof loginSchema>

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const login = useAuthStore((state) => state.login)
    const navigate = useNavigate()

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    const onSubmit = async (data: LoginSchema) => {
        setIsLoading(true)

        try {
            const { token } = await authApi.login(data)
            login(token)
            navigate("/")
            toast.success("Logged in successfully")
        } catch {
            toast.error("Invalid credentials")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container max-w-md mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Enter your username"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Enter your password"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Logging in..." : "Login"}
                            </Button>
                        </form>
                    </Form>
                    <p className="text-muted-foreground mt-4">
                        Demo data for admin:
                        <br />
                        Username: admin
                        <br />
                        Password: Admin@123
                    </p>
                    <p className="text-muted-foreground mt-4">
                        Demo data for user:
                        <br />
                        Username: basicuser
                        <br />
                        Password: User@123


                    </p>
                </CardContent>
            </Card>
        </div>
    )
}