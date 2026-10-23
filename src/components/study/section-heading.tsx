import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  overline: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeading({
  overline,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
        {overline}
      </p>
      <h2 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}
