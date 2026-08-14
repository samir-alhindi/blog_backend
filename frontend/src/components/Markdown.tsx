import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

// Map Markdown elements onto Folio's type + colour system. The editor stays a
// plain writing surface (matching the Stitch mockup); formatting only appears
// when a post is rendered, so writers who ignore Markdown lose nothing.
const components: Components = {
  h1: (props) => (
    <h2 className="font-display text-3xl text-on-surface mt-8 mb-4" {...props} />
  ),
  h2: (props) => (
    <h3 className="font-display text-2xl text-on-surface mt-8 mb-3" {...props} />
  ),
  h3: (props) => (
    <h4 className="font-display text-xl text-on-surface mt-6 mb-2" {...props} />
  ),
  p: (props) => <p className="mb-4 leading-relaxed" {...props} />,
  a: (props) => (
    <a
      className="text-primary underline underline-offset-2 hover:opacity-80"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  ul: (props) => <ul className="list-disc ps-6 mb-4 space-y-1" {...props} />,
  ol: (props) => <ol className="list-decimal ps-6 mb-4 space-y-1" {...props} />,
  li: (props) => <li className="leading-relaxed" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="border-s-4 border-outline-variant ps-4 italic text-on-surface-variant my-4"
      {...props}
    />
  ),
  code: (props) => {
    const { children, className } = props;
    // Fenced blocks arrive wrapped in <pre>; inline code is styled here.
    if (className?.includes("language-")) {
      return <code className={className}>{children}</code>;
    }
    return (
      <code className="font-mono text-sm bg-surface-container px-1.5 py-0.5 rounded">
        {children}
      </code>
    );
  },
  pre: (props) => (
    <pre
      className="font-mono text-sm bg-surface-container-high p-4 rounded-lg overflow-x-auto my-4"
      {...props}
    />
  ),
  hr: () => <hr className="border-outline-variant my-8" />,
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="rounded-lg my-4 max-w-full" alt={props.alt ?? ""} {...props} />
  ),
  table: (props) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props) => (
    <th className="border border-outline-variant px-3 py-2 text-start font-ui" {...props} />
  ),
  td: (props) => (
    <td className="border border-outline-variant px-3 py-2" {...props} />
  ),
};

export default function Markdown({ children }: { children: string }) {
  return (
    <div className="font-article text-lg text-on-surface">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
