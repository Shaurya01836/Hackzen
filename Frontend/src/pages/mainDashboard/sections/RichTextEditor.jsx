"use client";
import React, { useMemo, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Heading from '@tiptap/extension-heading';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import HardBreak from '@tiptap/extension-hard-break';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';

import FontFamily from '@tiptap/extension-font-family';
import FontSize from '@tiptap/extension-font-size';
import DOMPurify from 'dompurify';

const TOOLBAR_BUTTONS = [
  { cmd: 'toggleHeading', level: 1, label: 'H1' },
  { cmd: 'toggleHeading', level: 2, label: 'H2' },
  { cmd: 'toggleHeading', level: 3, label: 'H3' },
  { cmd: 'toggleBold', label: 'B' },
  { cmd: 'toggleItalic', label: 'I' },
  { cmd: 'toggleUnderline', label: 'U' },
  { cmd: 'toggleStrike', label: 'S' },
  { cmd: 'toggleBulletList', label: '• List' },
  { cmd: 'toggleOrderedList', label: '1. List' },
  { cmd: 'toggleBlockquote', label: '❝' },
  { cmd: 'toggleCodeBlock', label: '</>' },
  { cmd: 'setLink', label: '🔗' },
  { cmd: 'unsetLink', label: '⨉Link' },
  { cmd: 'insertBreak', label: '↵' },
  { cmd: 'setHighlight', label: 'BG' },
  { cmd: 'unsetHighlight', label: '⨉BG' },
  { cmd: 'setImage', label: '🖼️' },
  { cmd: 'insertTable', label: 'Table' },
  { cmd: 'deleteTable', label: 'DelTbl' },
  { cmd: 'clearFormatting', label: 'Clear' },
  { cmd: 'undo', label: '↺' },
  { cmd: 'redo', label: '↻' },
];

const COLORS = [
  "#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff",
  "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff"
];
const BG_COLORS = [
  "#ffff00", "#ffeb3b", "#ffe082", "#b2ff59", "#b3e5fc", "#d1c4e9", "#ffcdd2", "#fff"
];
const FONT_FAMILIES = [
  'Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana', 'Courier New', 'monospace'
];
const FONT_SIZES = [
  '12px', '14px', '16px', '18px', '24px', '32px', '48px'
];

export default function RichTextEditor({ value = "", onChange, placeholder = "Description", maxLength = 5000, editable = true }) {
  const [isMobile, setIsMobile] = useState(false);
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({ levels: [1, 2, 3] }),
      Underline,
      Strike,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
      TextStyle,
      Color,
      Highlight,
      HardBreak,
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,

      FontFamily,
      FontSize,
    ],
    content: value,
    editable,
    onUpdate: ({ editor }) => {
      let html = editor.getHTML();
      if (maxLength && editor.getText().length > maxLength) return;
      // Sanitize output
      html = DOMPurify.sanitize(html);
      onChange(html);
    },
    editorProps: {
      attributes: {
        spellCheck: 'true',
        'aria-label': 'Rich text editor',
      },
    },
  });

  const charCount = editor ? editor.getText().length : 0;

  const handleToolbar = (btn) => {
    if (!editor) return;
    if (btn.cmd === 'toggleHeading') {
      editor.chain().focus().toggleHeading({ level: btn.level }).run();
    } else if (btn.cmd === 'toggleBold') {
      editor.chain().focus().toggleBold().run();
    } else if (btn.cmd === 'toggleItalic') {
      editor.chain().focus().toggleItalic().run();
    } else if (btn.cmd === 'toggleUnderline') {
      editor.chain().focus().toggleUnderline().run();
    } else if (btn.cmd === 'toggleStrike') {
      editor.chain().focus().toggleStrike().run();
    } else if (btn.cmd === 'toggleBulletList') {
      editor.chain().focus().toggleBulletList().run();
    } else if (btn.cmd === 'toggleOrderedList') {
      editor.chain().focus().toggleOrderedList().run();
    } else if (btn.cmd === 'toggleBlockquote') {
      editor.chain().focus().toggleBlockquote().run();
    } else if (btn.cmd === 'toggleCodeBlock') {
      editor.chain().focus().toggleCodeBlock().run();
    } else if (btn.cmd === 'setLink') {
      const url = window.prompt('Enter URL');
      if (url) editor.chain().focus().setLink({ href: url }).run();
    } else if (btn.cmd === 'unsetLink') {
      editor.chain().focus().unsetLink().run();
    } else if (btn.cmd === 'insertBreak') {
      editor.chain().focus().setHardBreak().run();
    } else if (btn.cmd === 'setHighlight') {
      const color = window.prompt('Enter background color (hex or name):', '#ffff00');
      if (color) editor.chain().focus().setHighlight({ color }).run();
    } else if (btn.cmd === 'unsetHighlight') {
      editor.chain().focus().unsetHighlight().run();
    } else if (btn.cmd === 'setImage') {
      const url = window.prompt('Enter image URL');
      if (url) editor.chain().focus().setImage({ src: url }).run();
    } else if (btn.cmd === 'insertTable') {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    } else if (btn.cmd === 'deleteTable') {
      editor.chain().focus().deleteTable().run();
    } else if (btn.cmd === 'clearFormatting') {
      editor.chain().focus().unsetAllMarks().clearNodes().run();
    } else if (btn.cmd === 'undo') {
      editor.chain().focus().undo().run();
    } else if (btn.cmd === 'redo') {
      editor.chain().focus().redo().run();
    }
  };

  // Responsive toolbar: show dropdown on mobile
  const renderToolbar = () => (
    <nav className={`flex flex-wrap gap-1 mb-2 ${isMobile ? 'overflow-x-auto' : ''}`} aria-label="Editor toolbar">
      {TOOLBAR_BUTTONS.map((btn, i) => {
        let isActive = false;
        if (editor) {
          if (btn.cmd === 'toggleHeading') {
            isActive = editor.isActive('heading', { level: btn.level });
          } else if (btn.cmd === 'toggleBold') {
            isActive = editor.isActive('bold');
          } else if (btn.cmd === 'toggleItalic') {
            isActive = editor.isActive('italic');
          }
        }
        return (
          <button
            key={i}
            type="button"
            className={`px-2 py-1 rounded border text-xs font-semibold bg-white hover:bg-gray-100 ${isActive ? 'bg-blue-100 border-blue-400' : ''}`}
            onClick={() => handleToolbar(btn)}
            aria-label={btn.label}
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleToolbar(btn); }}
          >
            {btn.label}
          </button>
        );
      })}
      {/* Font family picker */}
      <select
        onChange={e => editor.chain().focus().setFontFamily(e.target.value).run()}
        value={editor.getAttributes('fontFamily').fontFamily || ''}
        className="border rounded px-1"
        aria-label="Font family"
      >
        <option value="">Font</option>
        {FONT_FAMILIES.map(f => <option key={f} value={f}>{f}</option>)}
      </select>
      {/* Font size picker */}
      <select
        onChange={e => editor.chain().focus().setFontSize(e.target.value).run()}
        value={editor.getAttributes('fontSize').fontSize || ''}
        className="border rounded px-1"
        aria-label="Font size"
      >
        <option value="">Size</option>
        {FONT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      {/* Text color picker */}
      <select
        onChange={e => editor.chain().focus().setColor(e.target.value).run()}
        value={editor.getAttributes('textStyle').color || ''}
        className="border rounded px-1"
        aria-label="Text color"
      >
        <option value="">A</option>
        {COLORS.map(color => (
          <option key={color} value={color} style={{ color, background: color }}>{color}</option>
        ))}
      </select>
      <button
        type="button"
        className="px-2 py-1 rounded border text-xs font-semibold bg-white hover:bg-gray-100"
        onClick={() => editor.chain().focus().unsetColor().run()}
        aria-label="Reset text color"
      >
        Reset Color
      </button>
      {/* Background color picker */}
      <select
        onChange={e => editor.chain().focus().setHighlight({ color: e.target.value }).run()}
        value={editor.getAttributes('highlight').color || ''}
        className="border rounded px-1"
        aria-label="Background color"
      >
        <option value="">BG</option>
        {BG_COLORS.map(color => (
          <option key={color} value={color} style={{ background: color }}>{color}</option>
        ))}
      </select>
      <button
        type="button"
        className="px-2 py-1 rounded border text-xs font-semibold bg-white hover:bg-gray-100"
        onClick={() => editor.chain().focus().unsetHighlight().run()}
        aria-label="Reset background color"
      >
        Reset BG
      </button>
    </nav>
  );

  return (
    <div className="border rounded-md p-2 bg-white">
      {renderToolbar()}
      <EditorContent editor={editor} className="min-h-[180px] ProseMirror" spellCheck={true} aria-label="Rich text editor content" />
      <div className="text-right text-xs text-gray-400 mt-1">
        {charCount}/{maxLength}
      </div>
    </div>
  );
}
