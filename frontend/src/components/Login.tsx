import { Button } from "@/components/ui/button"
import {
  Card
} from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"
import { LockIcon, UserIcon } from "lucide-react"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/api"

const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])$/;
const formSchema = z.object({
  username: z.string().min(2,{
    message: "A felhasználónévnek minimum 2 karakterből kell állnia."
  })
  .max(20,{
    message: "A felhasználónév maximum 20 karakterből állhat."
  }),
  password: z.string().min(8,{
    message: "A jelszónak minimum 8 karakterből kell állnia."
  })
  .max(20,{
    message: "A jelszó maximum 20 karakterből állhat."
  }).regex(passwordRegex, { message: "A jelszónak tartalmaznia kell kis- és nagybetűket[a-z, A-Z], valamint számot[0-9] és speciális karaktert is.[#,?,!,@,$,%,^,&,*,-]"}),
  
});

export function Login() {
  const navigate = useNavigate();
    function onSubmit(data: z.infer<typeof formSchema>){
    const [loading, setLoading] = useState(false);

    async function onSubmit(data: z.infer<typeof formSchema>){
      setLoading(true);
    try {
      const res = await api.post("/api/token/", {
        "username": data.username,
        "password": data.password
      })
      navigate("/home");
    } catch (error) {
      alert("Hiba történt a bejelentkezes során.") 
    } finally {
      setLoading(false);
    }

  }
    }
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          username: "",
          password: "",
        },
    })
  return (
    <div className="flex-col flex items-center justify-center min-h-screen bg-background">
        <h1 className="text-2xl font-bold pb-6">Damareen - Bejelentkezés</h1>
        <Card className="p-8 w-[90%] max-w-[450px]">
            
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Felhasználónév</FormLabel>
                    <FormControl>
                        <InputGroup>
                        <InputGroupInput autoComplete="none" {...field}/>
                        <InputGroupAddon>
                            <UserIcon/>
                        </InputGroupAddon>
                        </InputGroup>
                    </FormControl>
                    <FormMessage/>
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Jelszó</FormLabel>
                    <FormControl>
                        <InputGroup>
                        <InputGroupInput type="password" {...field}/>
                        <InputGroupAddon>
                            <LockIcon/>
                        </InputGroupAddon>
                        </InputGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button className="w-full" type="submit">Bejelentkezés</Button>
                
            </form>
            <FormItem className="flex w-full justify-center items-center gap-1">
                <FormLabel className="text-sm text-muted-foreground">Nincs még fiókod?</FormLabel>
                <Button onClick={() => navigate("/register")} variant="link" className="p-0 h-auto">Regisztrálj</Button>
            </FormItem>
            </Form>
      </Card>
    </div>
  )
}




