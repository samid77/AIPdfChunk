'use client'
import React from 'react'
import { Inbox } from 'lucide-react';
import {useDropzone} from 'react-dropzone';
import { uploadToS3 } from '@/lib/s3';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';


const FileUpload = () => {

  //SECTION - Mutation to call the create-chat API endpoint
  const {mutate} = useMutation({
    mutationFn: async({file_key, file_name}: {file_key: string, file_name: string}) => {
      const response = await axios.post('/api/create-chat', {file_key, file_name});
      return response.data
    }
  });


  //SECTION - Use the dropzone to upload PDF. File information and data parsed in `onDrop`
  const {getRootProps, getInputProps} = useDropzone({
    accept: {'application/pdf': ['.pdf']},
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
        console.log(`acceptedFiles: ${JSON.stringify(acceptedFiles, undefined, 2)}`)
        const file = acceptedFiles[0];
        if(file.size > 10 * 1024 * 1024) {
          toast.error(`File size is too big, more than 10MB`)
          return;
        }
        
        try {
          
          const data = await uploadToS3(file)
          console.log(`data: ${JSON.stringify(data, undefined, 2)}`)

          if(!data?.file_key || !data?.file_name) {
            toast.error('Something went wrong.')
            return;
          }
          mutate(data, {
            onSuccess: (data) => {console.log(`data from mutation: ${JSON.stringify(data, undefined, 2)}`)},
            onError: (err) => {
              toast.error('Error on creating the chat')
              console.error('Error on creating the chat')
            }
          });

        } catch (error) {
          console.error(`Upload to S3 Error: ${JSON.stringify(error, undefined, 2)}`)
        }
    },
  });

  return (
    <div className='p-2 bg-white rounded-xl'>
        <div {...getRootProps({
            className: 'border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col',
        })}>
            <input {...getInputProps()}/>
            <>
             <Inbox className='w-10 h-10 text-blue-500'/>
             <p className='mt-2 text-sm text-slate-400'>Drop PDF here</p>
            </>
        </div>
    </div>
  )
}

export default FileUpload