import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Jelentkezz be a fiókodba</CardTitle>
                <CardDescription>
                Add meg a felhasználóneved és jelszavad a belépéshez
                </CardDescription>
                
            </CardHeader>
            <CardContent>
                <form>
                <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                    <Label htmlFor="username">Felhasználónév</Label>
                    <Input
                        id="username"
                        type="username"
                        required
                    />
                    </div>
                    <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Jelszó</Label>
                    </div>
                    <Input id="password" type="password" required />
                    </div>
                </div>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full">
                Bejelentkezés
                </Button>
                <CardAction className="flex w-full justify-center items-center gap-1">
                <p className="text-sm text-muted-foreground">Nincs még fiókod?</p>
                <Button variant="link" className="p-0 h-auto">Regisztrálj</Button>
                </CardAction>
            </CardFooter>
        </Card>
    </div>
  )
}




