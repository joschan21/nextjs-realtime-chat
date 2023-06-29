import {FC} from 'react'
import JoinGroupButton from "@/Components/Buttons/wrapper/JoinGroupButton";

const page: FC = () => {
    return (
        <main className='pt-8'>
            <h1 className='font-bold text-5xl mb-8'>Join a group</h1>
            <JoinGroupButton/>
        </main>
    )
}

export default page
