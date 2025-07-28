import React, { useState, useRef, useEffect } from "react";

const TOOLBAR_BUTTONS = [
  { cmd: 'bold', label: 'B', style: { fontWeight: 'bold' } },
  { cmd: 'italic', label: 'I', style: { fontStyle: 'italic' } },
  { cmd: 'underline', label: 'U', style: { textDecoration: 'underline' } },
  { cmd: 'strikeThrough', label: 'S', style: { textDecoration: 'line-through' } },
  { cmd: 'h1', label: 'H1' },
  { cmd: 'h2', label: 'H2' },
  { cmd: 'h3', label: 'H3' },
  { cmd: 'insertUnorderedList', label: '• List' },
  { cmd: 'insertOrderedList', label: '1. List' },
  { cmd: 'justifyLeft', label: 'Left' },
  { cmd: 'justifyCenter', label: 'Center' },
  { cmd: 'justifyRight', label: 'Right' },
  { cmd: 'insertHorizontalRule', label: 'HR' },
  { cmd: 'removeFormat', label: 'Clear' },
  { cmd: 'undo', label: '↺' },
  { cmd: 'redo', label: '↻' }
];

const COLORS = [
  "#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff",
  "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff"
];

const BG_COLORS = [
  "#ffff00", "#ffeb3b", "#ffe082", "#b2ff59", "#b3e5fc", "#d1c4e9", "#ffcdd2", "transparent"
];

const FONT_FAMILIES = [
  'Arial', 
  'Georgia', 
  'Impact', 
  'Tahoma', 
  'Times New Roman', 
  'Verdana', 
  'Courier New'
];

const FONT_SIZES = ['10px', '12px', '14px', '16px', '18px', '24px', '32px', '48px'];

export default function RichTextEditor({ 
  value = "", 
  onChange = () => {}, 
  placeholder = "Start typing...", 
  maxLength = 5000, 
  editable = true 
}) {
  const [content, setContent] = useState(value);
  const [activeFormats, setActiveFormats] = useState(new Set());
  const editorRef = useRef(null);

  useEffect(() => {
    if (value !== content) {
      setContent(value);
      if (editorRef.current) {
        editorRef.current.innerHTML = value;
      }
    }
  }, [value]);

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const updateActiveFormats = () => {
    const formats = new Set();
    
    try {
      if (document.queryCommandState('bold')) formats.add('bold');
      if (document.queryCommandState('italic')) formats.add('italic');
      if (document.queryCommandState('underline')) formats.add('underline');
      if (document.queryCommandState('strikeThrough')) formats.add('strikeThrough');
      if (document.queryCommandState('insertUnorderedList')) formats.add('insertUnorderedList');
      if (document.queryCommandState('insertOrderedList')) formats.add('insertOrderedList');
    } catch (error) {
      // Ignore command state errors
    }
    
    setActiveFormats(formats);
  };

  const executeCommand = (command, value = null) => {
    if (!editorRef.current || !editable) return;
    
    editorRef.current.focus();
    
    try {
      if (command === 'h1') {
        document.execCommand('formatBlock', false, '<h1>');
      } else if (command === 'h2') {
        document.execCommand('formatBlock', false, '<h2>');
      } else if (command === 'h3') {
        document.execCommand('formatBlock', false, '<h3>');
      } else if (command === 'removeFormat') {
        // Clear all formatting including headings
        document.execCommand('formatBlock', false, '<div>');
        document.execCommand('removeFormat', false, null);
        // Also remove any inline styles
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const contents = range.extractContents();
          const textNode = document.createTextNode(contents.textContent || '');
          range.insertNode(textNode);
        }
      } else {
        document.execCommand(command, false, value);
      }
      
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      onChange(newContent);
      
      setTimeout(updateActiveFormats, 10);
    } catch (error) {
      console.warn('Command execution failed:', error);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      
      const textContent = editorRef.current.textContent || '';
      if (maxLength && textContent.length > maxLength) {
        return;
      }
      
      setContent(newContent);
      onChange(newContent);
      updateActiveFormats();
    }
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          executeCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          executeCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          executeCommand('underline');
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            executeCommand('redo');
          } else {
            executeCommand('undo');
          }
          break;
        case 'y':
          e.preventDefault();
          executeCommand('redo');
          break;
      }
    }
  };

  const handleColorChange = (color) => {
    executeCommand('foreColor', color);
  };

  const handleBackgroundColorChange = (color) => {
    executeCommand('hiliteColor', color === 'transparent' ? 'transparent' : color);
  };

  const handleFontFamilyChange = (fontFamily) => {
    if (fontFamily) {
      executeCommand('fontName', fontFamily);
    }
  };

  const handleFontSizeChange = (fontSize) => {
    if (!fontSize) return;
    
    editorRef.current.focus();
    const selection = window.getSelection();
    
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
      if (range.collapsed) {
        // No selection - apply to future typed text
        const span = document.createElement('span');
        span.style.fontSize = fontSize;
        span.innerHTML = '&nbsp;'; // Add space to make it work
        range.insertNode(span);
        
        // Position cursor inside the span
        const newRange = document.createRange();
        newRange.setStart(span.firstChild, 1);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      } else {
        // Text is selected - apply to selection
        const span = document.createElement('span');
        span.style.fontSize = fontSize;
        
        try {
          range.surroundContents(span);
        } catch (e) {
          // Fallback for complex selections
          const contents = range.extractContents();
          span.appendChild(contents);
          range.insertNode(span);
        }
        
        // Clear selection
        selection.removeAllRanges();
      }
      
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      onChange(newContent);
    }
  };

  const insertLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      executeCommand('insertImage', url);
    }
  };

  const insertTable = () => {
    const rows = parseInt(window.prompt('Number of rows:', '3')) || 3;
    const cols = parseInt(window.prompt('Number of columns:', '3')) || 3;
    
    let tableHTML = '<table border="1" style="border-collapse: collapse; margin: 10px 0; width: 100%;">';
    for (let i = 0; i < rows; i++) {
      tableHTML += '<tr>';
      for (let j = 0; j < cols; j++) {
        if (i === 0) {
          tableHTML += `<th style="padding: 8px; background-color: #f5f5f5; border: 1px solid #ddd;">Header ${j + 1}</th>`;
        } else {
          tableHTML += `<td style="padding: 8px; border: 1px solid #ddd;">Cell ${i}-${j + 1}</td>`;
        }
      }
      tableHTML += '</tr>';
    }
    tableHTML += '</table>';
    
    executeCommand('insertHTML', tableHTML);
  };

  const getCharCount = () => {
    if (editorRef.current) {
      return editorRef.current.textContent?.length || 0;
    }
    return 0;
  };

  const isButtonActive = (cmd) => {
    return activeFormats.has(cmd);
  };

  const editorStyles = {
    minHeight: '200px',
    maxHeight: '400px',
    overflowY: 'auto',
    lineHeight: '1.6',
    direction: 'ltr',
    textAlign: 'left',
    padding: '16px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    outline: 'none',
    fontSize: '14px'
  };

  // Add CSS for proper heading and list display
  const editorInnerHTML = `
    <style>
      [contenteditable] h1 { font-size: 2em; font-weight: bold; margin: 0.67em 0; }
      [contenteditable] h2 { font-size: 1.5em; font-weight: bold; margin: 0.75em 0; }
      [contenteditable] h3 { font-size: 1.17em; font-weight: bold; margin: 0.83em 0; }
      [contenteditable] ul, [contenteditable] ol { margin: 1em 0; padding-left: 2em; }
      [contenteditable] li { margin: 0.25em 0; list-style-position: inside; }
      [contenteditable] ul li { list-style-type: disc; }
      [contenteditable] ol li { list-style-type: decimal; }
      [contenteditable] blockquote { margin: 1em 0; padding-left: 1em; border-left: 4px solid #ccc; font-style: italic; }
      [contenteditable] pre { background: #f5f5f5; padding: 1em; border-radius: 4px; overflow-x: auto; }
      [contenteditable] a { color: #2563eb; text-decoration: underline; }
      [contenteditable] img { max-width: 100%; height: auto; margin: 0.5em 0; }
      [contenteditable] hr { border: none; border-top: 2px solid #ddd; margin: 1em 0; }
    </style>
  `;

  const placeholderStyles = {
    position: 'absolute',
    top: '16px',
    left: '16px',
    color: '#9ca3af',
    pointerEvents: 'none',
    fontSize: '14px'
  };

  return (
    <div className="">
      {/* Main Toolbar */}
      <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b">
        {TOOLBAR_BUTTONS.map((btn) => (
          <button
            key={btn.cmd}
            type="button"
            className={`px-3 py-1.5 rounded border text-sm font-medium transition-colors ${
              isButtonActive(btn.cmd) 
                ? 'bg-blue-500 text-white border-blue-500' 
                : 'bg-white hover:bg-gray-50 border-gray-300'
            }`}
            onClick={() => executeCommand(btn.cmd)}
            title={btn.label}
            disabled={!editable}
          >
            <span style={btn.style || {}}>{btn.label}</span>
          </button>
        ))}
      </div>

      {/* Secondary Toolbar */}
      <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b">
        {/* Font Family */}
        <select
          onChange={(e) => handleFontFamilyChange(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
          defaultValue=""
          disabled={!editable}
        >
          <option value="">Font Family</option>
          {FONT_FAMILIES.map(font => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>

        {/* Font Size */}
        <select
          onChange={(e) => handleFontSizeChange(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
          defaultValue=""
          disabled={!editable}
        >
          <option value="">Size</option>
          {FONT_SIZES.map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        {/* Text Color */}
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-600">Color:</span>
          {COLORS.slice(0, 7).map(color => (
            <button
              key={color}
              type="button"
              className="w-6 h-6 rounded border border-gray-300 hover:border-gray-400"
              style={{ backgroundColor: color }}
              onClick={() => handleColorChange(color)}
              title={`Text color: ${color}`}
              disabled={!editable}
            />
          ))}
        </div>

        {/* Background Color */}
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-600">BG:</span>
          {BG_COLORS.slice(0, 6).map(color => (
            <button
              key={color}
              type="button"
              className="w-6 h-6 rounded border hover:border-gray-400"
              style={{ 
                backgroundColor: color === 'transparent' ? '#fff' : color,
                border: color === 'transparent' ? '2px solid #ef4444' : '1px solid #d1d5db'
              }}
              onClick={() => handleBackgroundColorChange(color)}
              title={`Background: ${color}`}
              disabled={!editable}
            />
          ))}
        </div>

        {/* Special Actions */}
        <button
          type="button"
          className="px-2 py-1 rounded border border-gray-300 bg-white hover:bg-gray-50 text-sm disabled:opacity-50"
          onClick={insertLink}
          disabled={!editable}
        >
          🔗 Link
        </button>
        
        <button
          type="button"
          className="px-2 py-1 rounded border border-gray-300 bg-white hover:bg-gray-50 text-sm disabled:opacity-50"
          onClick={insertImage}
          disabled={!editable}
        >
          🖼️ Image
        </button>
        
        <button
          type="button"
          className="px-2 py-1 rounded border border-gray-300 bg-white hover:bg-gray-50 text-sm disabled:opacity-50"
          onClick={insertTable}
          disabled={!editable}
        >
          📋 Table
        </button>
      </div>

      {/* Editor Container */}
      <div className="relative">
        {/* Add styles for proper rendering */}
        <div dangerouslySetInnerHTML={{ __html: editorInnerHTML }} />
        
        {/* Placeholder */}
        {(!content || content === '') && (
          <div style={placeholderStyles}>
            {placeholder}
          </div>
        )}
        
        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable={editable}
          style={editorStyles}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onMouseUp={updateActiveFormats}
          onKeyUp={updateActiveFormats}
          suppressContentEditableWarning={true}
          className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Character Count */}
      <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
        <div>
          Use Ctrl+B for bold, Ctrl+I for italic, Ctrl+U for underline
        </div>
        <div>
          {getCharCount()}{maxLength ? `/${maxLength}` : ''} characters
        </div>
      </div>
    </div>
  );
}