import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx'
import { X } from 'lucide-react'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'
import { createToken } from '@/lib/api/common.api.ts'
import { getAppData } from '@/lib/api/terminal.api.ts'
import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import { LoadingIndicator } from '@/components/LoadingIndicator.tsx'

const loginSchema = z.object({
  accountname: z.string().min(1),
  password: z.string().min(1)
})

export const LoginDialog = ({ setToken }: { setToken: (token: string) => void }) => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string>()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { accountname: '', password: '' }
  })

  return (
    <Card className="max-w-[20rem] w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            setLoading(true)
            setMessage(undefined)
            const token = createToken(data.accountname, data.password)
            const result = await getAppData(token)
            if (result.result == 'Ok') {
              setToken(token)
              return
            }
            setLoading(false)
            if (result.result === 'Unauthorized') {
              setMessage('Hibás felhasználónév vagy jelszó')
            } else if (result.result == 'Forbidden') {
              setMessage('Nincs jogod használni az alkalmazást!')
            } else {
              setMessage(result.error || 'A belépés sikertelen!')
            }
          })}
        >
          <CardHeader>
            <CardTitle>Belépés</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="accountname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Felhasználónév</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <X className="w-4 h-4 m-auto mr-3 absolute top-0 bottom-0 right-0" onClick={() => form.setValue('accountname', '')} />
                      <Input autoComplete="accountname" placeholder="admin" {...field} />
                    </div>
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
                  <FormLabel>Jelszó</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <X className="w-4 h-4 m-auto mr-3 absolute top-0 bottom-0 right-0" onClick={() => form.setValue('password', '')} />
                      <Input autoComplete="current-password" type="password" placeholder="admin" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col">
            {loading && (
              <div className="pb-2">
                <LoadingIndicator />
              </div>
            )}
            {!!message && (
              <div className="pb-2">
                <span className="text-destructive text-center font-bold">{message}</span>
              </div>
            )}
            <Button className="w-full" type="submit" disabled={loading}>
              Belépés
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
