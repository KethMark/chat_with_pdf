'use client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { UploadDropzone } from "@bytescale/upload-widget-react";
import { FileText, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader } from '@/components/ui/loader';
import { env } from '@/lib/env';

export const DashboardClient = ({ docsList }:{ docsList: any}) => {

    const router = useRouter()
    const [ loading, isLoading ] = useState(false)

    const options = {
        apiKey: !!env.NEXT_PUBLIC_BYTESCALE_API_KEY
          ? env.NEXT_PUBLIC_BYTESCALE_API_KEY
          : 'no api key found',
        maxFileCount: 1,
        mimeTypes: ['application/pdf'],
        editor: { images: { crop: false } },
        styles: {
          colors: {
            primary: '#000',
            error: '#d23f4d',
          },
        },
    }

    const UploadDropZone = () => (
        <UploadDropzone
          options={options}
          onUpdate={({uploadedFiles}) => {
            if(uploadedFiles.length !== 0) {
              isLoading(true)
              ingestPdf(
                uploadedFiles[0].fileUrl,
                uploadedFiles[0].originalFile.originalFileName || uploadedFiles[0].filePath,
              )
            }
          }}
          width='470px'
          height='250px'
        />
    )

    async function ingestPdf(fileUrl: string, fileName: string) {
      let res = await fetch('/api/ingestPdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileUrl,
          fileName
        })
      })

      let data = await res.json()
      router.push(`/document/${data.id}`)
    }

    async function deleteDocument(id: string, fileUrl: string) {
      try {
        const res = await fetch('/api/deleteDocument', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id,
            fileUrl
          })
        })
        const data = await res.json()

        if(data.error) {
          console.log(data.error)
        } else {
          console.log("success")
          docsList.filter((doc: any)=> doc.id !== id)
          router.refresh()
        }

      } catch (error) {
        console.log("Error deleting document", error);
      }
    }

  return (
    <div className='container'>
      <div className='flex justify-between'>
        <div className='w-full mt-36'>
        {loading ? (
          <div className='flex justify-center mt-20'>
            <button
              type="button"
              className="inline-flex items-center mt-4 px-4 py-2 font-semibold leading-6 text-lg shadow rounded-md text-black transition ease-in-out duration-150 cursor-not-allowed"
            >
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Ingesting your PDF...
            </button>
          </div>
        ) : (
          <UploadDropZone />
        )}
        </div>
        <div className='w-full container mt-10 mx-auto'>
          <ScrollArea className='h-[520px] rounded-md border container'>
            <div>
              <h4 className='mb-8 text-sm font-medium leading-none mt-10'>recent</h4>
              {docsList.length > 0 ? (
                <div className='w-full'>
                  {docsList.map((docs: any) => (
                    <div
                      key={docs.id}
                      className="flex items-center justify-between mb-5"
                    >
                      <button
                        onClick={() =>  router.push(`/document/${docs.id}`)}
                        className="flex items-center gap-1 w-72"
                      >
                        <FileText className='flex-none'/>
                        <span className='line-clamp-1'>{docs.fileName}</span>
                      </button>
                      <div className='flex items-center gap-1'>
                        <span>{formatDistanceToNow(docs.createdAt)} ago</span>
                        <Trash2 className='h-5 w-5 cursor-pointer' onClick={() => deleteDocument(docs.id, docs.fileUrl)}/>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <h1 className='text-center mt-44'>There is no recent <strong>PDF File </strong> </h1>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
