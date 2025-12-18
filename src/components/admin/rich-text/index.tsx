"use client";

import "katex/dist/katex.min.css";
import { useRef, useState } from "react";
import { RichTextEditorContent } from "./editor-content";
import { useRichTextEditor } from "./hooks";
import { DialogMode, InsertDialog } from "./insert-dialog";
import { Toolbar } from "./toolbar";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "متن را وارد کنید...",
  className,
  minHeight = "80px",
}: RichTextEditorProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogValue, setDialogValue] = useState("");
  const dialogModeRef = useRef<DialogMode | null>(null);
  const applyCallbackRef = useRef<(val: string) => void>(() => {});

  const showDialog = (
    initial: string,
    mode: "inline" | "block",
    apply: (latex: string) => void
  ) => {
    setDialogValue(initial ?? "");
    applyCallbackRef.current = apply;
    dialogModeRef.current = mode === "inline" ? "math-inline" : "math-block";
    setDialogOpen(true);
  };

  const editor = useRichTextEditor({
    value,
    onChange,
    placeholder,
    minHeight,
    showDialog,
  });

  const handleInsertImage = () => {
    if (!editor) return;
    dialogModeRef.current = "image";
    setDialogValue("");
    applyCallbackRef.current = (url: string) => {
      if (url) editor.chain().focus().setImage({ src: url }).run();
    };
    setDialogOpen(true);
  };

  const handleInsertMath = () => {
    if (!editor) return;
    dialogModeRef.current = "math-inline";
    setDialogValue("");
    applyCallbackRef.current = (latex: string) => {
      if (latex) editor.chain().focus().insertInlineMath({ latex }).run();
    };
    setDialogOpen(true);
  };

  if (!editor) {
    return null;
  }

  return (
    <div
      className={cn(
        "border rounded-md overflow-hidden bg-background transition-colors",
        editor.isFocused &&
          "ring-2 ring-ring ring-offset-2 ring-offset-background",
        className
      )}
    >
      <Toolbar
        editor={editor}
        onInsertImage={handleInsertImage}
        onInsertMath={handleInsertMath}
      />

      <RichTextEditorContent editor={editor} placeholder={placeholder} />

      <InsertDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogModeRef.current}
        initialValue={dialogValue}
        onApply={applyCallbackRef.current}
      />
    </div>
  );
}
