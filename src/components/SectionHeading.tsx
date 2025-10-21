import clsx from "classnames";

export default function SectionHeading({ title, className }: { title: string; className?: string }) {
  return (
    <div className={clsx("flex items-center gap-4 select-none", className)}>
      <div className="h-px bg-slate-200 flex-1" />
      <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wide uppercase text-slate-900">
        {title}
      </h2>
      <div className="h-px bg-slate-200 flex-1" />
    </div>
  );
}
