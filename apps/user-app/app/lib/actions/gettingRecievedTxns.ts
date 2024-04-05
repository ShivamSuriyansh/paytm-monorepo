"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

interface Transaction {
    fromUserId: number;
    toUserId: number;
    amount: number;
    timestamp: Date;
}

async function gettingRecievedTxns() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        console.error("User session is not valid.");
        return;
    }

    const recievedTxns = await prisma.p2pTransfer.findMany({
        where: {
            toUserId: Number(session?.user?.id)
        }
    });
    
    // console.log('#Received Transactions: ', recievedTxns);
    return recievedTxns;
}

export default gettingRecievedTxns;
