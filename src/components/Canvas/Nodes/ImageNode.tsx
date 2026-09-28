import React, { useState } from 'react';
import { NodeItem } from '../../../types';
import { useProjectContext } from '../../../context/ProjectContext';
import { Image as ImageIcon, Upload, Link2 } from 'lucide-react';

interface ImageNodeProps {
  node: NodeItem;
}

const PRESET_IMAGES = [
  { label: 'Minimal Architecture', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80' },
  { label: 'Modern Workspace', url: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=600&q=80' },
  { label: 'Abstract Geometry', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80' },
  { label: 'Studio Travertine', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80' },
];

export const ImageNode: React.FC<ImageNodeProps> = ({ node }) => {
  const { updateNode } = useProjectContext();
  const [imgError, setImgError] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNode(node.id, { title: e.target.value });
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNode(node.id, { caption: e.target.value });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImgError(false);
    updateNode(node.id, { imageUrl: e.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setImgError(false);
          updateNode(node.id, { imageUrl: result }, true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2.5">
      {/* Title */}
      <input
        type="text"
        value={node.title}
        onChange={handleTitleChange}
        placeholder="Image caption / title..."
        className="w-full bg-transparent font-medium text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 rounded px-1 -mx-1"
      />

      {/* Image Preview Container */}
      <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/80 flex items-center justify-center">
        {node.imageUrl && !imgError ? (
          <img
            src={node.imageUrl}
            alt={node.caption || node.title || 'Canvas attachment'}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-1.5 text-neutral-400 dark:text-neutral-500 p-4 text-center">
            <ImageIcon className="w-8 h-8 opacity-60" />
            <span className="text-xs font-medium">
              {imgError ? 'Image failed to load' : 'No image attached'}
            </span>
            <span className="text-[10px] text-neutral-400">Paste URL or upload below</span>
          </div>
        )}
      </div>

      {/* Controls: URL Input & File Upload */}
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="flex-1 flex items-center gap-1 px-2 py-1 bg-black/[0.03] dark:bg-white/[0.03] rounded border border-black/5 dark:border-white/5">
            <Link2 className="w-3 h-3 text-neutral-400 shrink-0" />
            <input
              type="text"
              value={node.imageUrl || ''}
              onChange={handleUrlChange}
              placeholder="Paste image URL..."
              className="w-full bg-transparent text-[11px] text-neutral-700 dark:text-neutral-300 placeholder:text-neutral-400 focus:outline-none font-mono truncate"
            />
          </div>

          <label className="cursor-pointer p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 shrink-0" title="Upload local image">
            <Upload className="w-3.5 h-3.5" />
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Quick Presets Toggle */}
        <div className="pt-0.5">
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="text-[11px] text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 underline underline-offset-2"
          >
            {showPresets ? 'Hide presets' : 'Select sample photo preset'}
          </button>

          {showPresets && (
            <div className="grid grid-cols-2 gap-1 pt-1.5">
              {PRESET_IMAGES.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setImgError(false);
                    updateNode(node.id, { imageUrl: p.url }, true);
                    setShowPresets(false);
                  }}
                  className="text-left text-[10px] p-1.5 rounded bg-black/[0.03] dark:bg-white/[0.05] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 truncate"
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Caption */}
        <input
          type="text"
          value={node.caption || ''}
          onChange={handleCaptionChange}
          placeholder="Optional caption..."
          className="w-full bg-transparent text-[11px] text-neutral-500 dark:text-neutral-400 italic placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 rounded px-1"
        />
      </div>
    </div>
  );
};
