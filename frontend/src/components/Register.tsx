import { useForm } from "react-hook-form"
import { set, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserIcon, EyeIcon, EyeClosedIcon, LockIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants"
import { Navigate, useNavigate } from "react-router-dom"
import api from "@/api"
import { useState } from "react"
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
} from "@/components/ui/input-group"
import { Card } from "@/components/ui/card"

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
    <div className="w-full min-h-screen flex justify-center items-center">
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jelszó megerősítése</FormLabel>
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
            <Button className="w-full" type="submit">Regisztráció</Button>
          </form>
        </Form>
      </Card>
    </div>
  )
}