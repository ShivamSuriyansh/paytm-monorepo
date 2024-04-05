import { Card } from "@repo/ui/card";
import { P2pTransactions } from "../../../components/P2pTransactions";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";


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

export default function() {
    
    return  <div className="w-full">
    <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        Transactions
    </div>
    <div className="flex  p-4">
        <div className=" w-full">
            <Transaction />
        </div>
        
    </div>
</div>
}

export const Transaction = async()=>{
    const balance = await getBalance();
    const p2pTxns = await getP2pTransations();
    const session = await getServerSession(authOptions);
    const onRampTxns = await prisma.onRampTransaction.findMany({
        where : {
            userId : Number(session?.user?.id)
        }
    })
    const allTransactions:any = [...p2pTxns , ...onRampTxns];
    console.log('$$$$$$$$$$$$$$$$$$$$$ all transactions: ',allTransactions)
    return <Card title="Recent Transactions">
    <div className="pt-2 pb-2" >
        {allTransactions.map((t:any) => <div className="flex justify-between">
            <div>
                {/* <div className="text-sm">
                    SENT INR to {t.toUserId}
                </div> */}
                <div className="text-slate-600 text-xs">
                    {t?.timestamp?.toDateString() || t?.startTime.toDateString()}
                </div>
                <div className="text-slate-600 text-xs">
                    
                </div>
            </div>
            <div className="flex flex-col justify-center items-center">
            <div className=" flex justify-between gap-2 w-fit">
                    <div>
                        -{t.amount / 100}
                    </div>
                    <span> Rs</span>
                </div>
            </div>

        </div>)}
    </div>
</Card>
}

