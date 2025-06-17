"use client"

import React, { useState } from "react"
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuRadioGroup,
} from "./YourContextMenuFile" // adjust the import path

export default function DemoContextMenu() {
  const [checked, setChecked] = useState(true)
  const [radioValue, setRadioValue] = useState("apple")

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="p-6 bg-white rounded-md shadow-md cursor-context-menu select-none">
            Right click (or long press) here
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent className="w-56">
          <ContextMenuLabel inset>Actions</ContextMenuLabel>

          <ContextMenuItem onSelect={() => alert("New File")}>
            New File
            <ContextMenuShortcut>⌘N</ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuItem onSelect={() => alert("Save")}>
            Save As...
            <ContextMenuShortcut>⌘S</ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuCheckboxItem
            checked={checked}
            onCheckedChange={(checked) => setChecked(checked)}
          >
            Show Hidden Files
          </ContextMenuCheckboxItem>

          <ContextMenuSeparator />

          <ContextMenuLabel inset>Fruits</ContextMenuLabel>
          <ContextMenuRadioGroup
            value={radioValue}
            onValueChange={(value) => setRadioValue(value)}
          >
            <ContextMenuRadioItem value="apple">Apple</ContextMenuRadioItem>
            <ContextMenuRadioItem value="banana">Banana</ContextMenuRadioItem>
            <ContextMenuRadioItem value="orange">Orange</ContextMenuRadioItem>
          </ContextMenuRadioGroup>

          <ContextMenuSeparator />

          <ContextMenuSub>
            <ContextMenuSubTrigger inset>
              More Options
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem onSelect={() => alert("Settings")}>
                Settings
              </ContextMenuItem>
              <ContextMenuItem onSelect={() => alert("Help")}>
                Help
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}
