import { currentUser } from '@clerk/nextjs'
import type { User } from '@clerk/nextjs/api'
import prisma from '@/lib/prisma'
import  Documents  from './document'

const page = async ({ params }: { params: { id: string }}) => {

  const user: User | null = await currentUser()

  if(!user) return <div>No User been  logged in</div>

  const userDoc = await prisma.document.findFirst({
    where: {
      id: params.id,
      userId: user?.id
    }
  })

  if (!userDoc) {
    return <div className='text-center mt-40 font-bold text-5xl'>This document was not found</div>
  }

  return (
    <div>
      <Documents userDoc={userDoc} userImage={user?.imageUrl}/>
    </div>
  )
}

export default page