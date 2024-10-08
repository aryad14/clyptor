export default function AuthLayout({ children }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex justify-center items-center mt-28">
            {children}
        </div>
    )
}