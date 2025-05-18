
type HeaderProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
};

export function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className=" h-22 flex w-full items-center justify-between text-xs px-4">
      <div className="flex flex-col gap-2">
        <div className="font-bold text-xl">{title} </div>
        <div className=" text-sm">{subtitle}</div>
      </div>
      <div className="flex items-center gap-3">{actions}</div>
    </header>
  );
}

