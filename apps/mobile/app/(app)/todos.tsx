import { useState } from 'react'
import { Alert, FlatList, Pressable, View } from 'react-native'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createApi } from '@amoga/api'
import { todoCreateSchema } from '@amoga/schemas'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/providers/auth-provider'
import { Button, Card, Input, Text } from '@/components/ui'
const api = createApi(supabase)
export default function TodosScreen() {
 const { user } = useAuth(); const qc = useQueryClient(); const [title,setTitle]=useState('');
 const org = useQuery({ queryKey:['default-org',user?.id], enabled:!!user, queryFn: async()=>{ const { data,error }=await supabase.from('memberships').select('organization_id').eq('user_id',user!.id).limit(1).single(); if(error) throw error; return data.organization_id as string }})
 const todos = useQuery({ queryKey:['todos',org.data], enabled:!!org.data, queryFn:()=>api.todos.list(org.data!) })
 const create = useMutation({ mutationFn: async()=>{ const parsed=todoCreateSchema.safeParse({title}); if(!parsed.success) throw new Error(parsed.error.issues[0]?.message); return api.todos.create(org.data!,user!.id,parsed.data)}, onSuccess:()=>{setTitle(''); qc.invalidateQueries({queryKey:['todos',org.data]})}, onError:(e)=>Alert.alert('Could not add todo',e.message) })
 return <View className='flex-1 bg-background p-5'><Text className='mb-4 text-2xl font-bold'>Starter CRUD</Text><View className='mb-4 flex-row gap-2'><Input className='flex-1' placeholder='New todo' value={title} onChangeText={setTitle}/><Button onPress={()=>create.mutate()}>Add</Button></View><FlatList data={todos.data ?? []} keyExtractor={(item)=>item.id} renderItem={({item})=><Pressable onPress={async()=>{await api.todos.toggle(item.id,!item.completed); qc.invalidateQueries({queryKey:['todos',org.data]})}}><Card className='mb-2'><Text className={item.completed?'line-through text-muted-foreground':''}>{item.title}</Text></Card></Pressable>} ListEmptyComponent={<Text className='text-muted-foreground'>No items yet. Create the first one.</Text>} /></View>
}
