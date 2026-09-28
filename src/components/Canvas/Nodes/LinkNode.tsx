import React from 'react';
import { NodeItem } from '../../../types';
import { useProjectContext } from '../../../context/ProjectContext';
import { ExternalLink, Globe } from 'lucide-react';

interface LinkNodeProps {
  node: NodeItem;
}

export const LinkNode: React.FC<LinkNodeProps> = ({ node }) => {
  const { updateNode } = useProjectContext();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNode(node.id, { title: e.target.value });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNode(node.id, { url: e.target.value });
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNode(node.id, { linkDescription: e.target.value });
  };

  let domain = '';
  try {
    if (node.url) {
      const parsed = new URL(node.url.startsWith('http') ? node.url : `https://${node.url}`);
      domain = parsed.hostname.replace('www.', '');
    }
  } catch {
    domain = 'link';
  }

  const openLink = () => {
    if (!node.url) return;
    const targetUrl = node.url.startsWith('http') ? node.url : `https://${node.url}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-2.5">
      {/* Title */}
      <input
        type="text"
        value={node.title}
        onChange={handleTitleChange}
        placeholder="Link title..."
        className="w-full bg-transparent font-medium text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 rounded px-1 -mx-1"
      />

      {/* URL Input with Open Button */}
      <div className="flex items-center gap-1.5 p-1.5 bg-black/[0.03] dark:bg-white/[0.03] rounded-lg border border-black/5 dark:border-white/5">
        <Globe className="w-3.5 h-3.5 text-neutral-400 shrink-0 ml-1" />
        <input
          type="text"
          value={node.url || ''}
          onChange={handleUrlChange}
          placeholder="https://example.com"
          className="flex-1 min-w-0 bg-transparent text-xs text-neutral-700 dark:text-neutral-300 placeholder:text-neutral-400 focus:outline-none font-mono truncate"
        />
        {node.url && (
          <button
            onClick={openLink}
            title={`Open ${domain}`}
            className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Optional Description */}
      <textarea
        value={node.linkDescription || ''}
        onChange={handleDescChange}
        rows={2}
        placeholder="Add context or notes about this resource..."
        className="w-full resize-none bg-transparent text-xs text-neutral-600 dark:text-neutral-400 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 rounded p-1"
      />

      {domain && (
        <div className="text-[11px] text-neutral-400 font-mono truncate flex items-center gap-1">
          <span>Source:</span>
          <span className="text-neutral-600 dark:text-neutral-300 underline underline-offset-2">{domain}</span>
        </div>
      )}
    </div>
  );
};
