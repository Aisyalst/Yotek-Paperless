export default function SubmitOutlineButton({
    text,
    disabled,
    className = '',
}) {
    return (
        <button type="submit" className={`px-3 py-1 border border-green-500 text-green-500 rounded hover:bg-green-500 hover:text-white transition-colors rounded-md text-xs font-medium transition-colors shadow-sm ${className}`} disabled={disabled}>
            {text}
        </button>
    );
}
