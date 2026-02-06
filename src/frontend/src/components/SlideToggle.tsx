interface SlideToggleProps {
    active: boolean;
    onToggle: () => void;
}

export const SlideToggle = ({ active, onToggle }: SlideToggleProps) => {
    return (
        <div
            onClick={onToggle}
            className={`
        relative w-16 h-8 rounded-full cursor-pointer transition-colors duration-300 ease-in-out
        ${active ? 'bg-emerald-500 shadow-inner' : 'bg-stone-200'}
      `}
        >
            <div className={`
        absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300
        ${active ? 'translate-x-8' : 'translate-x-0'}
      `} />
        </div>
    );
};
