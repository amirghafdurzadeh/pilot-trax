"use client";

import "katex/dist/katex.min.css";
import { useRef, useState } from "react";
import { RichTextEditorContent } from "./editor-content";
import { useRichTextEditor } from "./hooks";
import { InsertImageDialog } from "./insert-image-dialog";
import { InsertMathDialog } from "./insert-math-dialog";
import { Toolbar, ToolbarDictionary } from "./toolbar";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  dictionary: ToolbarDictionary;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "متن را وارد کنید...",
  className,
  minHeight = "80px",
  dictionary,
}: RichTextEditorProps) {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [mathDialogOpen, setMathDialogOpen] = useState(false);
  const [dialogValue, setDialogValue] = useState("");
  const applyCallbackRef = useRef<(val: string) => void>(() => {});

  const showDialog = (
    initial: string,
    mode: "inline" | "block",
    apply: (latex: string) => void
  ) => {
    setDialogValue(initial ?? "");
    applyCallbackRef.current = apply;
    setMathDialogOpen(true);
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
    applyCallbackRef.current = (url: string) => {
      if (url) editor.chain().focus().setImage({ src: url }).run();
    };
    setImageDialogOpen(true);
  };

  const handleInsertMath = () => {
    if (!editor) return;
    setDialogValue("");
    applyCallbackRef.current = (latex: string) => {
      if (latex) editor.chain().focus().insertInlineMath({ latex }).run();
    };
    setMathDialogOpen(true);
  };

  return (
    <div
      className={cn(
        "border rounded-md overflow-hidden bg-background transition-colors",
        editor?.isFocused &&
          "ring-2 ring-ring ring-offset-2 ring-offset-background",
        className
      )}
    >
      {editor && (
        <>
          <Toolbar
            editor={editor}
            onInsertImage={handleInsertImage}
            onInsertMath={handleInsertMath}
            dictionary={dictionary}
          />

          <RichTextEditorContent editor={editor} placeholder={placeholder} />

          <InsertImageDialog
            open={imageDialogOpen}
            onOpenChange={setImageDialogOpen}
            onApply={applyCallbackRef.current}
          />
          <InsertMathDialog
            open={mathDialogOpen}
            onOpenChange={setMathDialogOpen}
            initialValue={dialogValue}
            onApply={applyCallbackRef.current}
          />
        </>
      )}
    </div>
  );
}
