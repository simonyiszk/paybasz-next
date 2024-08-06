import { useQuery } from 'react-query'
import { useAppContext } from '@/hooks/useAppContext'
import { userList } from '@/lib/api.ts'
import { LoadingIndicator } from '@/components/LoadingIndicator.tsx'
import { UserList, UserListItem } from '@/lib/model.ts'
import { fuzzySearch } from '@/lib/utils.ts'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input.tsx'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button.tsx'
import { Toggle } from '@/components/ui/toggle.tsx'
import { CircleAlert } from 'lucide-react'
import { ColorMarker } from '@/components/ColorMarker.tsx'

export const SelectUserStep = ({ setUser }: { setUser: (userId: UserListItem) => void }) => {
  const { gatewayName, gatewayCode } = useAppContext()
  const usersQuery = useQuery(
    ['user-list', gatewayName, gatewayCode],
    () =>
      userList({
        gatewayCode,
        gatewayName
      }),
    { keepPreviousData: true }
  )

  return (
    <>
      <h1 className="font-bold text-2xl pb-2 text-center">Válassz felhasználót!</h1>
      {!usersQuery.data && (
        <div className="mt-4">
          <LoadingIndicator />
        </div>
      )}

      {!!usersQuery.data && <SelectUser users={usersQuery.data} setUser={setUser} />}
    </>
  )
}

const userNameSchema = z.object({ name: z.string().optional() })

const SelectUser = ({ users, setUser }: { users: UserList; setUser: (userId: UserListItem) => void }) => {
  const form = useForm<z.infer<typeof userNameSchema>>({
    resolver: zodResolver(userNameSchema),
    defaultValues: { name: '' }
  })

  const [needle, setNeedle] = useState<string>()
  const [suggestions, setSuggestions] = useState(users)
  const [selectedUser, setSelectedUser] = useState<UserListItem>()

  useEffect(() => {
    if (!needle) {
      setSuggestions(users)
      return
    }

    const newSuggestions = fuzzySearch({ needle, haystack: users, getText: (user) => user.name + user.email })
    setSuggestions(newSuggestions)
  }, [users, needle])

  return (
    <>
      <Form {...form}>
        <form
          onChange={form.handleSubmit((data) => {
            setNeedle(data.name ?? '')
          })}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="pb-2">
                <FormLabel>Kereső</FormLabel>
                <FormControl>
                  <Input placeholder="Példa Péter" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <Button
        className="w-full mb-2"
        disabled={selectedUser === undefined}
        onClick={(e) => {
          e.preventDefault()
          if (selectedUser) {
            setUser(selectedUser)
          }
        }}
      >
        Kész
      </Button>

      {!!selectedUser?.hasCardAssigned && <p className="text-center pb-2">A felhasználóhoz már hozzá van rendelve egy kártya!</p>}
      <UserCardGrid suggestions={suggestions} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
    </>
  )
}

const UserCardGrid = ({
  suggestions,
  selectedUser,
  setSelectedUser
}: {
  suggestions: UserList
  selectedUser?: UserListItem
  setSelectedUser: (user: UserListItem) => void
}) => (
  <>
    {!!suggestions.length && (
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(175px,1fr))] gap-2 justify-center pb-2">
        {suggestions.map((suggestion) => (
          <Toggle
            className="px-4 py-2 flex flex-col relative overflow-clip"
            variant="outline"
            size="unset"
            key={suggestion.id}
            pressed={selectedUser?.id === suggestion.id}
            onPressedChange={() => setSelectedUser(suggestion)}
          >
            <ColorMarker color={suggestion.color} />
            {suggestion?.hasCardAssigned && <CircleAlert className="absolute w-5 h-5 top-2 right-2" />}
            <span className="text-wrap">{suggestion.name}</span>
            <small className="text-wrap">{suggestion.email}</small>
          </Toggle>
        ))}
      </div>
    )}

    {!suggestions.length && <p className="text-center">Nincs találat</p>}
  </>
)
