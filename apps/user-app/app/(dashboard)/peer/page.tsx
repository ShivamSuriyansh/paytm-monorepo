
import { getServerSession } from "next-auth";
import { SendCard } from "../../../components/SendCard";
import { authOptions } from "../../lib/auth";
import prisma from '@repo/db/client'
import { BalanceCard } from "../../../components/BalanceCard";
import { P2pTransactions } from "../../../components/P2pTransactions";

async function getBalance() {
    const session = await getServerSession(authOptions);
    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session?.user?.id)
        }
    });
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

async function getP2pTransations(){
    const session = await getServerSession(authOptions);
    const p2pTxns = await prisma.p2pTransfer.findMany({
        where : {
            fromUserId : Number(session?.user?.id)
        }
    })
    return p2pTxns.map(t=>({
        fromUserId : t.fromUserId,
        toUserId : t.toUserId,
        amount : t.amount,
        timestamp : t.timestamp
    }))
}

export default async function (){
    const balance = await getBalance();
    const p2pTxns = await getP2pTransations();
    return <div className="w-screen">
    <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        P2P Transfer
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <div>
            <SendCard />
        </div>
        <div>
            <BalanceCard amount={balance.amount} locked={balance.locked} />
            <div className="pt-4">
                <P2pTransactions p2ptransactions={p2pTxns} />
            </div>
        </div>
    </div>
</div>
}

