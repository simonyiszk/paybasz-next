import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'
import { X } from 'lucide-react'

const paymentDetailsSchema = z.object({
  amount: z.coerce.number().finite().gt(0),
  message: z.string().min(1)
})

export const EnterAmountAndMessageStep = ({
  setAmount,
  setMessage,
  messageKey,
  title,
  messagePlaceholder
}: {
  messagePlaceholder: string
  title?: string
  messageKey: string
  setAmount: (amount: number) => void
  setMessage: (message: string) => void
}) => {
  const form = useForm<z.infer<typeof paymentDetailsSchema>>({
    resolver: zodResolver(paymentDetailsSchema),
    defaultValues: {
      message: localStorage.getItem(messageKey) || undefined
    }
  })

  return (
    <>
      {title && <h1 className="font-bold text-2xl pb-2 text-center">{title}</h1>}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            setAmount(data.amount)
            setMessage(data.message)
            localStorage.setItem(messageKey, data.message)
          })}
        >
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="pb-4">
                <FormLabel>Mennyiség (JMF)</FormLabel>
                <FormControl>
                  <Input placeholder="1234" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="pb-4">
                <FormLabel>Üzenet</FormLabel>
                <FormControl>
                  <div className="relative">
                    <X className="w-4 h-4 m-auto mr-3 absolute top-0 bottom-0 right-0" onClick={() => form.setValue('message', '')} />
                    <Input placeholder={messagePlaceholder} {...field} />
                  </div>
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
