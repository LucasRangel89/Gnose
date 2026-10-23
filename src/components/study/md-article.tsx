"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

/**
 * MdArticle — renderização tipográfica do conteúdo completo dos estudos
 * (Markdown estático e confiável de public/conteudo/, sem HTML cru).
 *
 * Todo o estilo é aplicado via a prop `components` do react-markdown com
 * classes utilitárias Tailwind — nenhum CSS global é adicionado. Os tokens
 * do tema (background/foreground/primary/accent/border…) garantem o
 * funcionamento nos modos claro e escuro.
 */

/** Props que o react-markdown repassa para os componentes de elemento. */
interface MdElementProps {
  className?: string;
  children?: ReactNode;
}

/** Props do <tr>; `rowIndex` é injetado pelo <tbody> para o zebra. */
interface MdTrProps {
  className?: string;
  children?: ReactNode;
  rowIndex?: number;
}

/** Props de elementos com atributos úteis além de className/children. */
interface MdLinkProps extends MdElementProps {
  href?: string;
}

interface MdOrderedListProps extends MdElementProps {
  start?: number;
}

const components: Components = {
  h1: ({ className, children }: MdElementProps) => (
    <h1
      className={cn(
        "mt-2 mb-4 font-serif text-3xl font-semibold leading-tight text-foreground",
        className,
      )}
    >
      {children}
    </h1>
  ),
  h2: ({ className, children }: MdElementProps) => (
    <h2
      className={cn(
        "mt-10 mb-4 border-b border-primary/25 pb-2 font-serif text-2xl font-semibold text-primary",
        className,
      )}
    >
      {children}
    </h2>
  ),
  h3: ({ className, children }: MdElementProps) => (
    <h3
      className={cn(
        "mt-8 mb-3 font-serif text-xl font-semibold text-foreground/95",
        className,
      )}
    >
      {children}
    </h3>
  ),
  h4: ({ className, children }: MdElementProps) => (
    <h4
      className={cn(
        "mt-6 mb-2 font-serif text-lg font-semibold text-foreground/90",
        className,
      )}
    >
      {children}
    </h4>
  ),
  h5: ({ className, children }: MdElementProps) => (
    <h5
      className={cn(
        "mt-6 mb-2 font-serif text-base font-semibold text-foreground/85",
        className,
      )}
    >
      {children}
    </h5>
  ),
  h6: ({ className, children }: MdElementProps) => (
    <h6
      className={cn(
        "mt-6 mb-2 font-serif text-sm font-semibold uppercase tracking-wide text-muted-foreground",
        className,
      )}
    >
      {children}
    </h6>
  ),
  p: ({ className, children }: MdElementProps) => (
    <p
      className={cn(
        "my-3 text-[15px] leading-relaxed text-foreground/90",
        className,
      )}
    >
      {children}
    </p>
  ),
  blockquote: ({ className, children }: MdElementProps) => (
    <blockquote
      className={cn(
        "my-4 rounded-r-lg border-l-4 border-primary/50 bg-primary/[0.06] px-4 py-3 text-[14px] leading-relaxed text-foreground/85 [&_p]:my-0 [&_p]:text-[14px] [&_p]:leading-relaxed [&_p]:text-foreground/85",
        className,
      )}
    >
      {children}
    </blockquote>
  ),
  table: ({ children }: MdElementProps) => (
    <div className="study-scroll my-5 overflow-x-auto rounded-lg border bg-card/50">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }: MdElementProps) => <thead>{children}</thead>,
  tbody: ({ children }: MdElementProps) => (
    <tbody>
      {Children.map(children, (child, index) =>
        isValidElement(child)
          ? cloneElement(child as ReactElement<MdTrProps>, { rowIndex: index })
          : child,
      )}
    </tbody>
  ),
  tr: ({ className, children, rowIndex }: MdTrProps) => (
    <tr className={cn(typeof rowIndex === "number" && rowIndex % 2 === 1 && "bg-accent/20")}>
      {children}
    </tr>
  ),
  th: ({ className, children }: MdElementProps) => (
    <th
      className={cn(
        "border-b bg-accent/40 px-3 py-2 text-left font-semibold text-foreground",
        className,
      )}
    >
      {children}
    </th>
  ),
  td: ({ className, children }: MdElementProps) => (
    <td
      className={cn(
        "border-b border-border/60 px-3 py-2 align-top text-foreground/85",
        className,
      )}
    >
      {children}
    </td>
  ),
  ul: ({ className, children }: MdElementProps) => (
    <ul className={cn("my-3 list-disc space-y-1.5 pl-6", className)}>
      {children}
    </ul>
  ),
  ol: ({ className, children, start }: MdOrderedListProps) => (
    <ol
      start={start}
      className={cn("my-3 list-decimal space-y-1.5 pl-6", className)}
    >
      {children}
    </ol>
  ),
  li: ({ className, children }: MdElementProps) => (
    <li className={cn("leading-relaxed marker:text-primary/70", className)}>
      {children}
    </li>
  ),
  hr: ({ className }: MdElementProps) => (
    <hr className={cn("my-8 border-primary/20", className)} />
  ),
  a: ({ className, children, href }: MdLinkProps) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn("text-primary underline underline-offset-4", className)}
    >
      {children}
    </a>
  ),
  strong: ({ className, children }: MdElementProps) => (
    <strong className={cn("font-semibold text-foreground", className)}>
      {children}
    </strong>
  ),
  pre: ({ children }: MdElementProps) => (
    <pre className="study-scroll my-5 overflow-x-auto rounded-lg border bg-card/50 p-3">
      {children}
    </pre>
  ),
  code: ({ className, children }: MdElementProps) => {
    const isBlock = typeof className === "string" && /(?:^|\s)language-/.test(className);
    return (
      <code
        className={cn(
          isBlock
            ? "block bg-transparent p-0 text-[13px] leading-relaxed"
            : "rounded bg-accent px-1 py-0.5 text-[13px]",
          className,
        )}
      >
        {children}
      </code>
    );
  },
};

export function MdArticle({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
