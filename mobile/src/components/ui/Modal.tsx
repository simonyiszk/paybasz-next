export default function Modal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="h-full absolute z-30 w-full">
      <div className="flex items-center justify-center w-full h-full flex-row">
        <div
          className={` ${className ? className : ""} bg-gray-50 rounded-xl p-6`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
