export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 40 40"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect width="40" height="40" rx="10" className="fill-primary" />
            <path
                d="M12 31V18l8-6 8 6v13"
                fill="none"
                className="stroke-primary-foreground"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M16 31v-6h8v6"
                fill="none"
                className="stroke-primary-foreground"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
