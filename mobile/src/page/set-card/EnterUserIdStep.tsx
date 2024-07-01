import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'

const userFromSchema = z.object({
  userId: z.coerce.number().finite()
})

export const EnterUserIdStep = ({ setUserId }: { setUserId: (userId: number) => void }) => {
  const form = useForm<z.infer<typeof userFromSchema>>({
    resolver: zodResolver(userFromSchema)
  })

  return (
    <>
      <h1 className="font-bold text-2xl pb-2 text-center">Add meg a felhasználó azonosítóját!</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => setUserId(data.userId))}>
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem className="pb-4">
                <FormLabel>Azonosító</FormLabel>
                <FormControl>
                  <Input placeholder="1234" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit">
            Kész
          </Button>
        </form>
      </Form>
    </>
  )
}
