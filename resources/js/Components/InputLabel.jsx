export default function InputLabel({
    value,
    className = '',
    required = false,
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-sm font-medium text-gray-500 ` +
                className
            }
        >
            {value ? value : children}
            {required && <span style={{ color: '#e53e3e' }}> *</span>}
        </label>
    );
}
