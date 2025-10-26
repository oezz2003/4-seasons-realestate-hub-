'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Enter text...',
  className = '',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdating = useRef(false);

  // Update editor content when value changes externally
  useEffect(() => {
    if (editorRef.current && !isUpdating.current) {
      const currentContent = editorRef.current.innerHTML;
      if (currentContent !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isUpdating.current = true;
      onChange(editorRef.current.innerHTML);
      // Reset flag after a short delay
      setTimeout(() => {
        isUpdating.current = false;
      }, 0);
    }
  }, [onChange]);

  const insertLink = useCallback(() => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  }, [execCommand]);

  const insertImage = useCallback(() => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  }, [execCommand]);

interface ToolbarButton {
  icon?: any;
  command?: string;
  value?: string;
  label?: string;
  type?: 'separator';
  onClick?: () => void;
}

  const toolbarButtons: ToolbarButton[] = [
    { icon: Bold, command: 'bold', label: 'Bold' },
    { icon: Italic, command: 'italic', label: 'Italic' },
    { icon: Underline, command: 'underline', label: 'Underline' },
    { type: 'separator' },
    { icon: Heading1, command: 'formatBlock', value: 'h1', label: 'Heading 1' },
    { icon: Heading2, command: 'formatBlock', value: 'h2', label: 'Heading 2' },
    { icon: Heading3, command: 'formatBlock', value: 'h3', label: 'Heading 3' },
    { type: 'separator' },
    { icon: List, command: 'insertUnorderedList', label: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', label: 'Numbered List' },
    { type: 'separator' },
    { icon: Link, command: 'custom', onClick: insertLink, label: 'Insert Link' },
    { icon: ImageIcon, command: 'custom', onClick: insertImage, label: 'Insert Image' },
    { type: 'separator' },
    { icon: Undo, command: 'undo', label: 'Undo' },
    { icon: Redo, command: 'redo', label: 'Redo' },
  ];

  return (
    <div className={`rich-text-editor border border-gray-300 rounded-md ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-300 bg-gray-50 rounded-t-md">
        {toolbarButtons.map((button, index) => {
          if (button.type === 'separator') {
            return <div key={index} className="w-px h-6 bg-gray-300 mx-1" />;
          }

          const Icon = button.icon as any;
          return (
            <Button
              key={index}
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => {
                if (button.onClick) {
                  button.onClick();
                } else if (button.command === 'custom') {
                  // Already handled in onClick
                } else {
                  execCommand(button.command!, button.value);
                }
              }}
              title={button.label}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[200px] p-4 focus:outline-none"
        onInput={handleInput}
        data-placeholder={value ? '' : placeholder}
        suppressContentEditableWarning={true}
      />

      <style jsx global>{`
        .rich-text-editor [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          font-style: italic;
          pointer-events: none;
        }
        .rich-text-editor [contenteditable] {
          min-height: 200px;
        }
        .rich-text-editor [contenteditable] h1 {
          font-size: 2rem;
          font-weight: bold;
          margin: 1rem 0 0.5rem 0;
        }
        .rich-text-editor [contenteditable] h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 1rem 0 0.5rem 0;
        }
        .rich-text-editor [contenteditable] h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 0.75rem 0 0.5rem 0;
        }
        .rich-text-editor [contenteditable] ul, .rich-text-editor [contenteditable] ol {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .rich-text-editor [contenteditable] p {
          margin: 0.5rem 0;
        }
      `}</style>
    </div>
  );
}
