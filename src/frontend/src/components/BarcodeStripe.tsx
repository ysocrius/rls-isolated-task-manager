import { memo } from 'react';

export const BarcodeStripe = memo(() => {
    // Generate pseudo-random stripes for visualization
    const stripes = Array.from({ length: 40 }).map(() => ({
        height: Math.max(20, Math.random() * 100),
        opacity: Math.max(0.3, Math.random()),
        color: Math.random() > 0.9 ? 'bg-orange-500' : 'bg-emerald-500'
    }));

    return (
        <div className="flex items-end justify-between h-32 w-full gap-1 p-4 bg-stone-50 rounded-lg border border-stone-200 shadow-inner">
            {stripes.map((stripe, index) => (
                <div
                    key={index}
                    className={`w-1.5 rounded-t-sm transition-all duration-500 ${stripe.color}`}
                    style={{
                        height: `${stripe.height}%`,
                        opacity: stripe.opacity
                    }}
                />
            ))}
        </div>
    );
});
