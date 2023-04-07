import { FC } from 'react'
import Skeleton from "react-loading-skeleton"

interface loadingProps {}

const loading: FC<loadingProps> = ({}) => {
  return (
<div className='flex flex-col h-full items-center'>
      <Skeleton className='mb-4' height={40} width={400} />
      {/* chat messages */}
      <div className='flex-1 max-h-full overflow-y-scroll w-full'>
        <div className='flex flex-col flex-auto h-full p-6'>
          <div className='flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-50 h-full p-4'>
            <div className='flex flex-col h-full overflow-x-auto mb-4'>
              <div className='flex flex-col h-full'>
                <div className='grid grid-cols-12 gap-y-2'>
                  <div className='col-start-6 col-end-13 p-3 rounded-lg'>
                    <div className='flex items-center justify-start flex-row-reverse'>
                      <div className='relative h-10 w-10'>
                        <Skeleton width={40} height={40} borderRadius={999} />
                      </div>
                      <div className='relative mr-3 text-sm bg-indigo-100 text-black py-2 px-4 border border-gray-100 rounded-xl'>
                        <Skeleton className='ml-2' width={150} height={20} />
                      </div>
                    </div>
                  </div>
                  <div className='col-start-6 col-end-13 p-3 rounded-lg'>
                    <div className='flex items-center justify-start flex-row-reverse'>
                      <div className='relative h-10 w-10'>
                        <Skeleton width={40} height={40} borderRadius={999} />
                      </div>
                      <div className='relative mr-3 text-sm bg-indigo-100 text-black py-2 px-4 border border-gray-100 rounded-xl'>
                        <Skeleton className='ml-2' width={150} height={20} />
                      </div>
                    </div>
                  </div>

                  {/* my messages */}
                  <div className='col-start-1 col-end-8 p-3 rounded-lg'>
                    <div className='flex flex-row items-center'>
                      <div className='relative h-10 w-10'>
                        <Skeleton width={40} height={40} borderRadius={999} />
                      </div>
                      <div className='relative ml-3 text-sm bg-white py-2 px-4 border border-gray-100 rounded-xl'>
                        <Skeleton className='ml-2' width={150} height={20} />
                      </div>
                    </div>
                  </div>
                  <div className='col-start-6 col-end-13 p-3 rounded-lg'>
                    <div className='flex items-center justify-start flex-row-reverse'>
                      <div className='relative h-10 w-10'>
                        <Skeleton width={40} height={40} borderRadius={999} />
                      </div>
                      <div className='relative mr-3 text-sm bg-indigo-100 text-black py-2 px-4 border border-gray-100 rounded-xl'>
                        <Skeleton className='ml-2' width={150} height={20} />
                      </div>
                    </div>
                  </div>
                  <div className='col-start-1 col-end-8 p-3 rounded-lg'>
                    <div className='flex flex-row items-center'>
                      <div className='relative h-10 w-10'>
                        <Skeleton width={40} height={40} borderRadius={999} />
                      </div>
                      <div className='relative ml-3 text-sm bg-white py-2 px-4 border border-gray-100 rounded-xl'>
                        <Skeleton className='ml-2' width={150} height={20} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* chat input */}

      {/* <ChatInput
        chatPartner={chatPartner}
        img={session.user.image}
        chatId={chatId}
      /> */}
    </div>
  )
}

export default loading
