export function TransactionsLoading() {
    return (
        <div className="space-y-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
                        <div className="space-y-2">
                            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
                            <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
                        </div>
                    </div>
                    <div className="text-right space-y-2">
                        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>
            ))}
        </div>
    );
}