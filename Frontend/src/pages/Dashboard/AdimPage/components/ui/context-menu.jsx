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
} from "./YourContextMenuFile" // adjust this path

export default function DemoContextMenu() {
  const [checked, setChecked] = useState(true)
  const [radioValue, setRadioValue] = useState("apple")

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="p-6 bg-white rounded-lg shadow-md cursor-pointer select-none border border-gray-200 hover:shadow-lg transition">
            Right click (or long press) here
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent className="w-56 bg-white text-gray-800 border border-gray-200 shadow-lg rounded-md">
          <ContextMenuLabel inset className="text-xs uppercase text-gray-500 px-2 py-1">
            Actions
          </ContextMenuLabel>

          <ContextMenuItem
            onSelect={() => alert("New File")}
            className="hover:bg-gray-100 px-2 py-2 rounded-md cursor-pointer"
          >
            New File
            <ContextMenuShortcut>⌘N</ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuItem
            onSelect={() => alert("Save")}
            className="hover:bg-gray-100 px-2 py-2 rounded-md cursor-pointer"
          >
            Save As...
            <ContextMenuShortcut>⌘S</ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuSeparator className="my-1 border-t border-gray-100" />

          <ContextMenuCheckboxItem
            checked={checked}
            onCheckedChange={(checked) => setChecked(checked)}
            className="hover:bg-gray-100 px-2 py-2 rounded-md cursor-pointer"
          >
            Show Hidden Files
          </ContextMenuCheckboxItem>

          <ContextMenuSeparator className="my-1 border-t border-gray-100" />

          <ContextMenuLabel inset className="text-xs uppercase text-gray-500 px-2 py-1">
            Fruits
          </ContextMenuLabel>

          <ContextMenuRadioGroup
            value={radioValue}
            onValueChange={setRadioValue}
          >
            <ContextMenuRadioItem
              value="apple"
              className="hover:bg-gray-100 px-2 py-2 rounded-md cursor-pointer"
            >
              Apple
            </ContextMenuRadioItem>
            <ContextMenuRadioItem
              value="banana"
              className="hover:bg-gray-100 px-2 py-2 rounded-md cursor-pointer"
            >
              Banana
            </ContextMenuRadioItem>
            <ContextMenuRadioItem
              value="orange"
              className="hover:bg-gray-100 px-2 py-2 rounded-md cursor-pointer"
            >
              Orange
            </ContextMenuRadioItem>
          </ContextMenuRadioGroup>

          <ContextMenuSeparator className="my-1 border-t border-gray-100" />

          <ContextMenuSub>
            <ContextMenuSubTrigger inset className="hover:bg-gray-100 px-2 py-2 rounded-md cursor-pointer">
              More Options
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="bg-white border border-gray-200 shadow-md rounded-md">
              <ContextMenuItem
                onSelect={() => alert("Settings")}
                className="hover:bg-gray-100 px-2 py-2 rounded-md cursor-pointer"
              >
                Settings
              </ContextMenuItem>
              <ContextMenuItem
                onSelect={() => alert("Help")}
                className="hover:bg-gray-100 px-2 py-2 rounded-md cursor-pointer"
              >
                Help
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}
