"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from '@repo/db/client'


export default async function createOnRampTxn(amount : number , provider : string){
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;
    const token = Math.random().toString();

    if(!userId){
        return {
            message : 'user not logged in '
        }
    }

    try{
        await prisma.onRampTransaction.create({
            data: {
                userId : Number(userId),
                status : 'Processing',
                amount : amount,
                token : token,
                startTime: new Date(),
                provider : provider
            }
        })
        return { "message" : " on ramp Txn is processing "}
        
    }catch(e){
        return {
            "message" : "transaction failed"
        }
    }
}