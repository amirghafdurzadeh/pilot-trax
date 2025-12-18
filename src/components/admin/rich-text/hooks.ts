"use client";

import { useEditor } from "@tiptap/react";
import { useEffect, useRef } from "react";
import { getEditorExtensions } from "./extensions";
import { cn } from "@/lib/utils";

export interface RichTextEditorHookProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  showDialog: (
    initial: string,
    mode: "inline" | "block",
    apply: (latex: string) => void
  ) => void;
}

export function useRichTextEditor({
  value,
  onChange,
  placeholder = "متن را وارد کنید...",
  minHeight = "80px",
  showDialog,
}: RichTextEditorHookProps) {
  const editorRef = useRef<any>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: getEditorExtensions(editorRef, showDialog),
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "p-3 outline-none min-h-[80px] prose prose-sm max-w-none dark:prose-invert",
          "[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded",
          "[&_.tiptap-mathematics-render]:bg-muted [&_.tiptap-mathematics-render]:px-1 [&_.tiptap-mathematics-render]:py-0.5 [&_.tiptap-mathematics-render]:rounded [&_.tiptap-mathematics-render]:cursor-pointer [&_.tiptap-mathematics-render]:inline-block"
        ),
        style: `min-height: ${minHeight}`,
      },
    },
  });

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return editor;
}
