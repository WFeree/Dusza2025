import { Button } from "@/components/ui/button"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants"
import {
  Card,
  CardAction
} from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton } from "./ui/input-group"
import { LockIcon, UserIcon } from "lucide-react"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { EyeIcon, EyeClosedIcon } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/api"
import { is } from "zod/v4/locales"

const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
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
  const [isPVisible,setPIsVisible] = useState(false)
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function onSubmit(data: z.infer<typeof formSchema>) {
      setLoading(true);
      try {
        const res = await api.post("/api/token/", {
          "username": data.username,
          "password": data.password
        })

        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

      navigate("/");
    } catch (error) {
      alert("Hiba történt a bejelentkezes során.") 
    } finally {
      setLoading(false);
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
    <div className="w-full min-h-screen flex flex-col items-center justify-center ">
      <h1 className="text-2xl font-bold pb-6">Damareen - Bejelentkezés</h1>
        <Card className="p-6 w-[90%] max-w-[500px]">
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
                        <InputGroupInput type={isPVisible ? 'text' : 'password'} className="pr-9" {...field}/>
                        <InputGroupButton
                          variant='ghost'
                          size="xs"
                          onClick={() => setPIsVisible(prevState => !prevState)}
                          className='text-muted-foreground mr-4 focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent'
                        ></InputGroupButton>
                        <InputGroupAddon>
                          <LockIcon/>
                        </InputGroupAddon>
                        {isPVisible ? 
                        <EyeClosedIcon color="#737373" size={18} strokeWidth={1.8} className="mr-4"/> : 
                        <EyeIcon color="#737373" size={18} strokeWidth={1.8} className="mr-4"/>
                        }
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full" type="submit">Bejelentkezés</Button>

              {loading && <div>Betöltés...</div>}

              <FormItem className="flex w-full justify-center items-center gap-1">
                <FormLabel className="text-sm text-muted-foreground">Már van fiókod?</FormLabel>
                <Button onClick={() => navigate("/register")} variant="link" className="p-0 h-auto">Regisztrálj!</Button>
              </FormItem>
            </form>
          </Form>
      </Card>
    </div>
  )}




