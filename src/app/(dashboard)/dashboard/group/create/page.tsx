import {FC} from 'react'
import CreateGroupButton from "@/Components/Buttons/wrapper/CreateGroupButton";

const page: FC = () => {
    return (
        <main className='pt-8'>
            <h1 className='font-bold text-5xl mb-8'>Create a group</h1>
            <CreateGroupButton/>
        </main>
    )
}

export default page
