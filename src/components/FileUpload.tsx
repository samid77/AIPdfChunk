'use client'
import React from 'react'
import { Inbox } from 'lucide-react';
import {useDropzone} from 'react-dropzone';
import { uploadToS3 } from '@/lib/s3';


const FileUpload = () => {

  //SECTION - Use the dropzone to upload PDF. File information and data parsed in `onDrop`
  const {getRootProps, getInputProps} = useDropzone({
    accept: {'application/pdf': ['.pdf']},
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
        console.log(`acceptedFiles: ${JSON.stringify(acceptedFiles, undefined, 2)}`)
        const file = acceptedFiles[0];
        if(file.size > 10 * 1024 * 1024) alert(`File size is too big, more than 10MB`);
        
        try {
          const data = await uploadToS3(file)
          console.log(`data: ${JSON.stringify(data, undefined, 2)}`)
        } catch (error) {
          console.error(`uploadtoS3 error ${error}`)
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