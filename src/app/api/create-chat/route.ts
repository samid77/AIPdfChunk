import { NextResponse } from "next/server"

 export async function POST(req: Request, res: Response) {
    try {
        
        const body = await req.json();
        const [file_key, file_name] = body();
        console.log(`File Key: ${file_key}`)
        console.log(`File Name: ${file_name}`)

    } catch (error) {
        console.error(`Error in create-chat POST endpoint: ${JSON.stringify(error, undefined, 2)}`)
        return NextResponse.json(
            {error: 'Internal Server Error - create-chat POST endpoint'},
            {status: 500},
        )
    }
 }