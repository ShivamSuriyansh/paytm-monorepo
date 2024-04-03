import { Card } from "@repo/ui/card"


export const P2pTransactions = ({
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
    return <Card title="Recent Transactions">
        <div className="pt-2">
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
                <div className="flex flex-col justify-center">
                    - Rs {t.amount / 100}
                </div>

            </div>)}
        </div>
    </Card>
}