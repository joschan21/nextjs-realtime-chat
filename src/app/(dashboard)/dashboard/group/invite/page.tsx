import {FC} from 'react'
import InviteJoinGroupButton from "@/Components/Buttons/wrapper/InviteJoinGroupButton";

const page: FC = () => {
    return (
        <main className='pt-8'>
            <h1 className='font-bold text-5xl mb-8'>Invite a user to join group</h1>
            <InviteJoinGroupButton/>
        </main>
    )
}

export default page
