

import prisma from "@repo/db/client"
import { Card } from "@repo/ui/card"
import { getServerSession } from "next-auth"
import { useState } from "react"
import { authOptions } from "../app/lib/auth"
import gettingRecievedTxns from "../app/lib/actions/gettingRecievedTxns"


interface transaction {
    fromUserId : number,
    toUserId : number,
    amount : number,
    timestamp : Date,
}

export const P2pTransactions = async ({
    p2ptransactions
}: {
    p2ptransactions: {
        fromUserId : number
        toUserId : number,
        amount : number
        timestamp :  Date,
    }[]
}) => {
    if (!p2ptransactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent peer transactions
            </div>
        </Card>
    }
    // make a db call to fetch the users with recieved trasactions 
    // const [received, setReceived] = useState<transaction[]>([]);
    const recievedTransactions =await  gettingRecievedTxns();
    console.log('rand p2p transactions' , recievedTransactions, "this is recieved transactions : ", p2ptransactions);

    return <Card title="Recent Transactions">
        <div className="pt-2 pb-2" >
            {p2ptransactions.map(t => <div className="flex justify-between">
                <div>
                    <div className="text-sm">
                        SENT INR to {t.toUserId}
                    </div>
                    <div className="text-slate-600 text-xs">
                        {t.timestamp.toDateString()}
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
            <div className="pt-2 pb-2 " >
            { recievedTransactions && recievedTransactions.map(t => <div className="flex justify-between">
                <div>
                    <div className="text-sm">
                        Recieved INR from {t.toUserId}
                    </div>
                    <div className="text-slate-600 text-xs">
                        {t.timestamp.toDateString()}
                    </div>
                    <div className="text-slate-600 text-xs">
                        
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                    
                    <div className=" flex justify-between gap-2">
                        <div>
                            +{t.amount / 100}
                        </div>
                        <span> Rs</span>
                    </div>
                </div>

            </div>)}
            </div>
        </div>
    </Card>
}