import { useForm } from "react-hook-form"
import { set, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { UserIcon, EyeIcon, EyeClosedIcon, LockIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants"
import { useNavigate } from "react-router-dom"
import api from "@/api"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group"
import { Card, CardAction } from "@/components/ui/card"
import { useState } from "react"


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
  confirmPassword: z.string().min(8,{
    message: "A jelszónak minimum 8 karakterből kell állnia."
  })
  .max(20,{
    message: "A felhasználónév maximum 20 karakterből állhat."
  })}).superRefine((data, ctx) => {
  if(data.password !== data.confirmPassword){
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "A jelszavak nem egyeznek.",
      path: ["confirmPassword"]
    })
  }
});

export default function Register(){
  const [isPVisible, setPIsVisible] = useState(false);
  const [isPCVisible, setPCIsVisible] = useState(false);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: ""
    },
  })
  async function onSubmit(data: z.infer<typeof formSchema>){
    setLoading(true);
    try {
      const res = await api.post("/api/user/register/", {
        "username": data.username,
        "password": data.password
      })
      navigate("/login");
    } catch (error) {
      alert("Hiba történt a regisztráció során.") 
    } finally {
      setLoading(false);
    }

  }
  return(
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold pb-6">Damareen - Regisztráció</h1>
      <Card className="p-8 w-[90%] max-w-[500px]">
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jelszó megerősítése</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupInput type={isPCVisible ? 'text' : 'password'} className="pr-9" {...field}/>
                      <InputGroupButton
                        variant='ghost'
                        size="xs"
                        onClick={() => setPCIsVisible(prevState => !prevState)}
                        className='text-muted-foreground mr-4 focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent'>
                      </InputGroupButton>
                      <InputGroupAddon>
                        <LockIcon/>
                      </InputGroupAddon>
                      {isPCVisible ? 
                      <EyeClosedIcon color="#737373" size={18} strokeWidth={1.8} className="mr-4"/> : 
                      <EyeIcon color="#737373" size={18} strokeWidth={1.8} className="mr-4"/>
                      }
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit">Regisztráció</Button>
          </form>
            <FormItem className="flex w-full justify-center items-center gap-1">
                <FormLabel className="text-sm text-muted-foreground">Már van fiókod?</FormLabel>
                <Button onClick={() => navigate("/login")} variant="link" className="p-0 h-auto">Jelentkezz be!</Button>
            </FormItem>
        </Form>
      </Card>
    </div>
  )
}