"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import prisma from '@repo/db/client'

export default async function(amount : number , to : string) {
    const session  = await getServerSession(authOptions);
    const from = session?.user?.id;

    if(!from) {
        return {
            "message" : "Error while sending"
        }
    }

    const toUser = await prisma.user.findFirst({
        where : {
            number : to
        }
    });

    if(!toUser){
        return {
            message : "user doesn't exists"
        }
    }

    await prisma.$transaction(async (tx)=>{
        // THIS QUERY WILL LOCK THIS DATABASE ROW SO THAT NO 2 REQUEST NEEDS TO WAIT OR BYPASS THE CHECK
        await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;

        const fromBalance = await tx.balance.findUnique({
            where: {
                userId : Number(from)
            }
        })
        if (!fromBalance || fromBalance.amount < amount) {
            throw new Error('Insufficient Funds')
            }

        await tx.balance.update({
            where : {
                userId : Number(from)
            },
            data : {
                amount : {
                    decrement : amount
                }
            }
        })
        await tx.balance.update({
            where : {
                userId : toUser.id
            },
            data : {
                amount : {
                    increment : amount
                }
            }
        })
        await tx.p2pTransfer.create({
            data : {
                fromUserId : Number(from),
                toUserId : toUser.id,
                amount,
                timestamp : new Date(),
            }
        })
    });

    return {
        message : "Transaction succesfull"
    }
    

}