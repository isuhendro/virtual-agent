'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownRendererProps {
  content: string;
}

/**
 * Markdown Renderer Component
 * Renders markdown content with syntax highlighting and proper styling
 */
export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Code blocks with syntax highlighting
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';

            return !inline && language ? (
              <SyntaxHighlighter
                style={oneDark}
                language={language}
                PreTag="div"
                className="rounded-lg my-2"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="inline-code" {...props}>
                {children}
              </code>
            );
          },
          // Headings
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mt-6 mb-3 text-gray-900">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold mt-5 mb-2 text-gray-900">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-900">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-semibold mt-3 mb-2 text-gray-900">{children}</h4>
          ),
          // Paragraphs
          p: ({ children }) => (
            <p className="mb-3 text-[15px] leading-relaxed text-gray-900">{children}</p>
          ),
          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-3 space-y-1 ml-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-3 space-y-1 ml-2">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-[15px] leading-relaxed text-gray-900">{children}</li>
          ),
          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {children}
            </a>
          ),
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 py-2 my-3 italic text-gray-700 bg-gray-50">
              {children}
            </blockquote>
          ),
          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto my-3">
              <table className="min-w-full border border-gray-300">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-100">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 px-4 py-2 text-gray-900">{children}</td>
          ),
          // Horizontal rule
          hr: () => <hr className="my-4 border-t border-gray-200" />,
          // Strong (bold)
          strong: ({ children }) => (
            <strong className="font-bold text-gray-900">{children}</strong>
          ),
          // Emphasis (italic)
          em: ({ children }) => (
            <em className="italic text-gray-900">{children}</em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>

      <style jsx global>{`
        .markdown-content .inline-code {
          background-color: #f3f4f6;
          color: #ef4444;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: 'Monaco', 'Courier New', monospace;
          font-size: 0.875em;
        }

        .markdown-content pre {
          margin: 0.5rem 0;
        }

        /* Task list styling for GitHub Flavored Markdown */
        .markdown-content input[type="checkbox"] {
          margin-right: 0.5rem;
        }
      `}</style>
    </div>
  );
}
