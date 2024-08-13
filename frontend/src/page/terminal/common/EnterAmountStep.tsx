import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useAppContext } from '@/hooks/useAppContext.ts'

const paymentDetailsSchema = z.object({
  amount: z.coerce.number().int().finite().gt(0)
})

export const EnterAmountStep = ({ setAmount, title }: { title?: string; setAmount: (amount: number) => void }) => {
  const { currencySymbol } = useAppContext().config
  const form = useForm<z.infer<typeof paymentDetailsSchema>>({
    resolver: zodResolver(paymentDetailsSchema),
    defaultValues: {
      amount: '' as never as number
    }
  })

  return (
    <>
      {title && <h1 className="font-bold text-2xl pb-2 text-center">{title}</h1>}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            setAmount(data.amount)
          })}
        >
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="pb-4">
                <FormLabel>Mennyiség ({currencySymbol})</FormLabel>
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
