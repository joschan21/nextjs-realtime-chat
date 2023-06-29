'use client'

import axios, {AxiosError} from 'axios'
import {FC, useState} from 'react'
import Button from '@/Components/Buttons/base/Button'
import {z} from 'zod'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {InviteUserToGroupValidator} from "@/lib/validations/add-group";
import {toast} from "react-hot-toast";

interface JoinGroupButtonProps {
}

type FormData = z.infer<typeof InviteUserToGroupValidator>

const JoinGroupButton: FC<JoinGroupButtonProps> = ({}) => {

    const [showSuccessState, setShowSuccessState] = useState<boolean>(false)
    const {
        register,
        handleSubmit,
        setError,
        formState: {errors, isLoading},
    } = useForm<FormData>({
        resolver: zodResolver(InviteUserToGroupValidator),
    })

    const joinGroup = async (group_name_input: string, email_input: string) => {
        try {
            // validate user input
            const {group_name, email} = InviteUserToGroupValidator.parse({
                group_name: group_name_input,
                email: email_input
            })


            await toast.promise(axios.post('/api/groups/invite', {
                    group_name,
                    email,
                }), {
                    loading: "loading",
                    success: "success",
                    error: "Sorry an error has occured"
                }
            )

            setShowSuccessState(true)
        } catch (error) {
            console.error(error)
            if (error instanceof z.ZodError) {
                setError('group_name', {message: error.message})
                return
            }

            if (error instanceof AxiosError) {
                setError('group_name', {message: error.response?.data})
                return
            }

            setError('group_name', {message: 'Something went wrong.'})
        }
    }

    const onSubmit = async (data: FormData) => {
        setShowSuccessState(false);
        await joinGroup(data.group_name, data.email)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='max-w-sm'>

            <div className='mt-2 flex gap-4 flex-col'>
                <input
                    {...register('email')}
                    type='email'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    placeholder='email@example.com'
                    required={true}
                />
                <input
                    {...register('group_name')}
                    type='text'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    placeholder='LSI_2023'
                    required={true}
                />
                <Button isLoading={isLoading}>Invite</Button>
            </div>
            <p className='mt-1 text-sm text-red-600'>{errors.group_name?.message}</p>
            {showSuccessState ? (
                <p className='mt-1 text-sm text-green-600'>Group join request sent!</p>
            ) : null}
        </form>
    )
}

export default JoinGroupButton
