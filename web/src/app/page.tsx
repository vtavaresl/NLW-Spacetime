// TypeScript + JSX = TSX
// JSX = JavaScript + XML
import { EmptyMemories } from '@/components/EmptyMemories'
import { api } from '@/lib/api'
import { cookies } from 'next/headers'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

dayjs.locale(ptBr)

interface Memory {
  id: string
  coverUrl: string
  excerpt: string
  createdAt: string
}

export default async function Home() {
  const isAuthenticated = cookies().has('token')

  if (!isAuthenticated) {
    return <EmptyMemories />
  }

  const token = cookies().get('token')?.value
  const response = await api.get('/memories', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const memories: Memory[] = response.data

  if (memories.length === 0) {
    return <EmptyMemories />
  }

  return (
    <div className="flex flex-col gap-10 p-8">
      {memories.map((memory) => {
        return (
          <div key={memory.id} className="space-y-4">
            <span className="flex items-center justify-between">
              <time className="-ml-8 flex items-center text-sm text-gray-100 before:mr-2 before:h-px before:w-5 before:bg-gray-50">
                {dayjs(memory.createdAt).format('D[ de ]MMMM[, ]YYYY')}
              </time>
              <span className="right-0 flex gap-2">
                {/* <Link
                  title="edit"
                  href="/memories/edit"
                  className="border-1 flex h-6 w-6 items-center justify-center rounded-full border-black bg-purple-800 text-sm text-gray-200 hover:bg-purple-300 hover:text-gray-800"
                >
                  <Pencil className="h-4 w-4" />
                </Link>

                <Link
                  title="delete"
                  href="/memories/delete"
                  className="border-1 flex h-6 w-6 items-center justify-center rounded-full border-black bg-gray-300 text-sm text-gray-200 hover:bg-gray-100 hover:text-gray-800"
                >
                  <X className="h-4 w-4" />
                </Link> */}
              </span>
            </span>
            <Image
              src={memory.coverUrl}
              width={592}
              height={280}
              className="aspect-video w-full rounded-lg object-cover"
              alt=""
            />
            <p className="text-lg leading-relaxed text-gray-100">
              {memory.excerpt}
            </p>

            <Link
              href={`/memories/${memory.id}`}
              className="flex items-center gap-2 text-sm text-gray-200 hover:text-gray-100"
            >
              Ler mais
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )
      })}
    </div>
  )
}
