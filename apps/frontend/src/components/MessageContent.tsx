import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageContentProps {
  text: string;
}

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="apple-heading mt-5 mb-2 text-[20px] font-semibold text-[var(--text-primary)] first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="apple-heading mt-4 mb-2 text-[17.5px] font-semibold text-[var(--text-primary)] first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="apple-heading mt-3.5 mb-1.5 text-[15.5px] font-semibold text-[var(--text-primary)] first:mt-0">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mt-3 mb-1 text-[14.5px] font-semibold text-[var(--text-primary)] first:mt-0">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="my-2.5 leading-[1.65] text-[var(--text-primary)] first:mt-0 last:mb-0">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="my-2.5 list-disc space-y-1.5 pl-5 text-[var(--text-primary)] first:mt-0 last:mb-0">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2.5 list-decimal space-y-1.5 pl-5 text-[var(--text-primary)] first:mt-0 last:mb-0">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="leading-[1.6] marker:text-[var(--text-tertiary)]">
      {children}
    </li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-[var(--text-primary)]">
      {children}
    </strong>
  ),
  em: ({ children }) => (
    <em className="italic text-[var(--text-primary)]">{children}</em>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-3 rounded-r-xl border-l-[3px] border-[var(--accent)]/60 bg-[var(--surface-segment)]/55 py-2 pr-3.5 pl-3.5 text-[14.5px] text-[var(--text-secondary)]">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-4 border-t border-[var(--surface-hairline)]" />,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-medium text-[var(--accent)] underline decoration-[var(--accent)]/40 underline-offset-2 hover:decoration-[var(--accent)]"
    >
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="my-3 overflow-x-auto rounded-2xl border border-[var(--surface-hairline)]">
      <table className="w-full border-collapse text-left text-[13.5px]">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-[var(--surface-segment)] text-[12.5px] font-semibold text-[var(--text-secondary)]">
      {children}
    </thead>
  ),
  th: ({ children }) => (
    <th className="border-b border-[var(--surface-hairline)] px-3.5 py-2">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-[var(--surface-hairline)] px-3.5 py-2 last:border-b-0">
      {children}
    </td>
  ),
  pre: ({ children }) => (
    <div className="my-3 overflow-hidden rounded-2xl border border-[var(--surface-hairline)] bg-black/[0.04] dark:bg-black/40">
      <pre className="overflow-x-auto p-3.5 font-mono text-[13px] leading-relaxed text-[var(--text-primary)]">
        {children}
      </pre>
    </div>
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = Boolean(className) || String(children).includes("\n");
    if (isBlock) {
      const lang = className?.replace(/^language-/, "");
      return (
        <>
          {lang && (
            <span className="mb-2 block border-b border-[var(--surface-hairline)] pb-1.5 font-mono text-[11px] font-medium text-[var(--text-secondary)]">
              {lang}
            </span>
          )}
          <code className="font-mono text-[13px]" {...props}>
            {children}
          </code>
        </>
      );
    }

    return (
      <code
        className="rounded-md bg-[var(--surface-segment)] px-1.5 py-0.5 font-mono text-[13px] text-[var(--text-primary)]"
        {...props}
      >
        {children}
      </code>
    );
  },
};

const MessageContent = ({ text }: MessageContentProps) => {
  return (
    <div className="text-[15px] text-[var(--text-primary)]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

export default MessageContent;
