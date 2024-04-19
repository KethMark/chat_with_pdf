import { currentUser } from '@clerk/nextjs';
import prisma from "@/lib/prisma";
import { DashboardClient } from './client';
import type { User } from '@clerk/nextjs/api';

const page = async () => {

  const user: User | null = await currentUser();

  if(!user) return <div>No User been  logged in</div>

  const docsList = await prisma.document.findMany({
    where: {
      userId: user?.id,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div>
        <DashboardClient docsList={docsList} />
    </div>
  )
}

export default page