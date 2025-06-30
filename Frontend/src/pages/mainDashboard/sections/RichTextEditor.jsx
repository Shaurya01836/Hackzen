"use client"
import { useState, useRef, useCallback, useEffect } from "react"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Link,
  MoreHorizontal,
  Undo,
  Redo,
  Palette,
  Highlighter,
  Type,
  ChevronDown
} from "lucide-react"
import { Button } from "../../../components/CommonUI/button"
import { Separator } from "../../../components/CommonUI/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../../../components/AdminUI/dropdown-menu"

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Description",
  maxLength = 5000
}) {
  const editorRef = useRef(null)
  const [activeFormats, setActiveFormats] = useState(new Set())
  const [wordCount, setWordCount] = useState(0)

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || `<p><br></p>`
    }
  }, [value])

  // Update active formats based on current selection
  const updateActiveFormats = useCallback(() => {
    const formats = new Set()

    try {
      if (document.queryCommandState("bold")) formats.add("bold")
      if (document.queryCommandState("italic")) formats.add("italic")
      if (document.queryCommandState("underline")) formats.add("underline")
      if (document.queryCommandState("strikeThrough"))
        formats.add("strikethrough")
      if (document.queryCommandState("insertOrderedList"))
        formats.add("ordered-list")
      if (document.queryCommandState("insertUnorderedList"))
        formats.add("bullet-list")
      if (document.queryCommandState("justifyLeft")) formats.add("align-left")
      if (document.queryCommandState("justifyCenter"))
        formats.add("align-center")
      if (document.queryCommandState("justifyRight")) formats.add("align-right")
      if (document.queryCommandState("justifyFull"))
        formats.add("align-justify")
    } catch (e) {
      // Handle any errors with queryCommandState
    }

    setActiveFormats(formats)
  }, [])

  // Handle content changes
  const handleContentChange = useCallback(() => {
    if (!editorRef.current) return

    const content = editorRef.current.innerHTML
    const textContent = editorRef.current.textContent || ""

    // Check length limit
    if (maxLength && textContent.length > maxLength) {
      return
    }

    setWordCount(textContent.length)
    onChange(content)
    updateActiveFormats()
  }, [onChange, maxLength, updateActiveFormats])

  // Execute formatting commands
  const executeCommand = useCallback(
    (command, value) => {
      try {
        document.execCommand(command, false, value)
        editorRef.current?.focus()
        handleContentChange()
      } catch (e) {
        console.warn("Command execution failed:", command , e)
      }
    },
    [handleContentChange]
  )

  // Handle key events
  const handleKeyDown = useCallback(
    e => {
      // Handle Ctrl+Z (Undo) and Ctrl+Y (Redo)
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z" && !e.shiftKey) {
          e.preventDefault()
          executeCommand("undo")
        } else if ((e.key === "z" && e.shiftKey) || e.key === "y") {
          e.preventDefault()
          executeCommand("redo")
        } else if (e.key === "b") {
          e.preventDefault()
          executeCommand("bold")
        } else if (e.key === "i") {
          e.preventDefault()
          executeCommand("italic")
        } else if (e.key === "u") {
          e.preventDefault()
          executeCommand("underline")
        }
      }
    },
    [executeCommand]
  )

  // Handle paste events to clean up formatting
  const handlePaste = useCallback(
    e => {
      e.preventDefault()
      const text = e.clipboardData.getData("text/plain")
      executeCommand("insertText", text)
    },
    [executeCommand]
  )

  const ToolbarButton = ({
    icon: Icon,
    format,
    command,
    value,
    onClick,
    tooltip
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      title={tooltip}
      className={`h-9 w-9 p-0 rounded-md hover:bg-gray-100 transition-colors ${
        format && activeFormats.has(format)
          ? "bg-blue-50 text-blue-600 border border-blue-200"
          : "text-gray-600 hover:text-gray-900"
      }`}
      onClick={() => {
        if (onClick) {
          onClick()
        } else if (command) {
          executeCommand(command, value)
        }
      }}
    >
      <Icon className="h-4 w-4" />
    </Button>
  )

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
      {/* Toolbar */}
      <div className="border-b border-gray-100 p-3 bg-gray-50/50">
        <div className="flex items-center gap-1 flex-wrap">
          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <ToolbarButton icon={Undo} command="undo" tooltip="Undo (Ctrl+Z)" />
            <ToolbarButton icon={Redo} command="redo" tooltip="Redo (Ctrl+Y)" />
          </div>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Font Style */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Type className="h-4 w-4 mr-2" />
                <span className="text-sm">Normal</span>
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuItem
                onClick={() => executeCommand("formatBlock", "p")}
              >
                <span className="text-sm">Normal</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => executeCommand("formatBlock", "h1")}
              >
                <span className="text-lg font-bold">Heading 1</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => executeCommand("formatBlock", "h2")}
              >
                <span className="text-base font-bold">Heading 2</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => executeCommand("formatBlock", "h3")}
              >
                <span className="text-sm font-bold">Heading 3</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Text Formatting */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              icon={Bold}
              format="bold"
              command="bold"
              tooltip="Bold (Ctrl+B)"
            />
            <ToolbarButton
              icon={Italic}
              format="italic"
              command="italic"
              tooltip="Italic (Ctrl+I)"
            />
            <ToolbarButton
              icon={Underline}
              format="underline"
              command="underline"
              tooltip="Underline (Ctrl+U)"
            />
            <ToolbarButton
              icon={Strikethrough}
              format="strikethrough"
              command="strikeThrough"
              tooltip="Strikethrough"
            />
            <ToolbarButton
              icon={Code}
              onClick={() => executeCommand("formatBlock", "pre")}
              tooltip="Code Block"
            />
          </div>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Text Color */}
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  title="Text Color"
                >
                  <Palette className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="p-3">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-700">
                    Text Color
                  </p>
                  <div className="grid grid-cols-8 gap-1">
                    {[
                      { color: "#000000", name: "Black" },
                      { color: "#374151", name: "Gray" },
                      { color: "#dc2626", name: "Red" },
                      { color: "#ea580c", name: "Orange" },
                      { color: "#ca8a04", name: "Yellow" },
                      { color: "#16a34a", name: "Green" },
                      { color: "#2563eb", name: "Blue" },
                      { color: "#9333ea", name: "Purple" }
                    ].map(({ color, name }) => (
                      <div
                        key={color}
                        className="w-6 h-6 rounded cursor-pointer border-2 border-gray-200 hover:border-gray-400 transition-all hover:scale-110"
                        style={{ backgroundColor: color }}
                        title={name}
                        onClick={() => executeCommand("foreColor", color)}
                      />
                    ))}
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  title="Highlight Color"
                >
                  <Highlighter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="p-3">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-700">
                    Highlight Color
                  </p>
                  <div className="grid grid-cols-6 gap-1">
                    {[
                      { color: "transparent", name: "None" },
                      { color: "#fef08a", name: "Yellow" },
                      { color: "#bbf7d0", name: "Green" },
                      { color: "#bfdbfe", name: "Blue" },
                      { color: "#f3e8ff", name: "Purple" },
                      { color: "#fed7aa", name: "Orange" }
                    ].map(({ color, name }) => (
                      <div
                        key={color}
                        className="w-6 h-6 rounded cursor-pointer border-2 border-gray-200 hover:border-gray-400 transition-all hover:scale-110"
                        style={{ backgroundColor: color }}
                        title={name}
                        onClick={() => executeCommand("backColor", color)}
                      />
                    ))}
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Alignment */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              icon={AlignLeft}
              format="align-left"
              command="justifyLeft"
              tooltip="Align Left"
            />
            <ToolbarButton
              icon={AlignCenter}
              format="align-center"
              command="justifyCenter"
              tooltip="Align Center"
            />
            <ToolbarButton
              icon={AlignRight}
              format="align-right"
              command="justifyRight"
              tooltip="Align Right"
            />
            <ToolbarButton
              icon={AlignJustify}
              format="align-justify"
              command="justifyFull"
              tooltip="Justify"
            />
          </div>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Lists */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              icon={List}
              format="bullet-list"
              command="insertUnorderedList"
              tooltip="Bullet List"
            />
            <ToolbarButton
              icon={ListOrdered}
              format="ordered-list"
              command="insertOrderedList"
              tooltip="Numbered List"
            />
            <ToolbarButton
              icon={Indent}
              command="indent"
              tooltip="Increase Indent"
            />
            <ToolbarButton
              icon={Outdent}
              command="outdent"
              tooltip="Decrease Indent"
            />
          </div>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Insert */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              icon={Link}
              onClick={() => {
                const url = prompt("Enter URL:")
                if (url) executeCommand("createLink", url)
              }}
              tooltip="Insert Link"
            />

            {/* More */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  title="More Options"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => executeCommand("insertHorizontalRule")}
                >
                  Insert Divider
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => executeCommand("formatBlock", "blockquote")}
                >
                  Insert Quote
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => executeCommand("removeFormat")}
                >
                  Clear Formatting
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative bg-white">
        <div
          ref={editorRef}
          contentEditable
          className="w-full min-h-[300px] p-4 border-0 resize-none focus:outline-none text-gray-800 leading-relaxed"
          style={{
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: "14px",
            lineHeight: "1.6"
          }}
          onInput={handleContentChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onMouseUp={updateActiveFormats}
          onKeyUp={updateActiveFormats}
          suppressContentEditableWarning={true}
          placeholder={placeholder}
        />

        {/* Character Count */}
        {maxLength && (
          <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-gray-100">
            {wordCount}/{maxLength}
          </div>
        )}
      </div>
    </div>
  )
}
