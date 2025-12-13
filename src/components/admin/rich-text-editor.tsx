"use client";

import Image from "@tiptap/extension-image";
import { Mathematics } from "@tiptap/extension-mathematics";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "katex/dist/katex.min.css";
import { BoldIcon, ImageIcon, ItalicIcon, SigmaIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

function createMathExtension(
  editorRef: React.MutableRefObject<Editor | null>,
  // showDialog(initialLatex, mode, applyCallback)
  showDialog: (
    initial: string,
    mode: "inline" | "block",
    apply: (latex: string) => void
  ) => void
) {
  return Mathematics.configure({
    inlineOptions: {
      onClick: (node, pos) => {
        const currentEditor = editorRef.current;
        if (!currentEditor) return;
        showDialog(node.attrs.latex ?? "", "inline", (latex) => {
          currentEditor
            .chain()
            .setNodeSelection(pos)
            .updateInlineMath({ latex })
            .focus()
            .run();
        });
      },
    },
    blockOptions: {
      onClick: (node, pos) => {
        const currentEditor = editorRef.current;
        if (!currentEditor) return;
        showDialog(node.attrs.latex ?? "", "block", (latex) => {
          currentEditor
            .chain()
            .setNodeSelection(pos)
            .updateBlockMath({ latex })
            .focus()
            .run();
        });
      },
    },
    katexOptions: {
      throwOnError: false,
      displayMode: false,
    },
  });
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "متن را وارد کنید...",
  className,
  minHeight = "80px",
}: RichTextEditorProps) {
  const editorRef = useRef<Editor | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogValue, setDialogValue] = useState("");
  const dialogModeRef = useRef<"image" | "math-inline" | "math-block" | null>(
    null
  );
  const applyCallbackRef = useRef<(val: string) => void>(() => {});

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded",
        },
      }),
      createMathExtension(editorRef, (initial, mode, apply) => {
        setDialogValue(initial ?? "");
        applyCallbackRef.current = apply;
        dialogModeRef.current =
          mode === "inline" ? "math-inline" : "math-block";
        setDialogOpen(true);
      }),
    ],
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

  // Sync external value changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

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
      <div className="flex items-center gap-1 p-1 border-b bg-muted/30">
        <Button
          type="button"
          variant={editor.isActive("bold") ? "secondary" : "ghost"}
          size="icon"
          className="h-7 w-7"
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold (Ctrl+B)"
        >
          <BoldIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("italic") ? "secondary" : "ghost"}
          size="icon"
          className="h-7 w-7"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic (Ctrl+I)"
        >
          <ItalicIcon className="h-4 w-4" />
        </Button>
        <div className="w-px h-5 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleInsertImage}
          title="درج تصویر"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleInsertMath}
          title="درج فرمول LaTeX"
        >
          <SigmaIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div className="relative">
        <EditorContent editor={editor} />
        {editor.isEmpty && (
          <div className="absolute top-3 right-3 text-muted-foreground pointer-events-none text-sm">
            {placeholder}
          </div>
        )}
      </div>

      {/* Dialog for image / math input */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogModeRef.current === "image" ? "درج تصویر" : "فرمول LaTeX"}
            </DialogTitle>
            <DialogDescription>
              {dialogModeRef.current === "image"
                ? "آدرس تصویر را وارد کنید"
                : "فرمول LaTeX را وارد کنید"}
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <Input
              value={dialogValue}
              onChange={(e) => setDialogValue(e.target.value)}
              placeholder={
                dialogModeRef.current === "image"
                  ? "https://example.com/image.png"
                  : "x^2 + y^2 = z^2"
              }
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">لغو</Button>
            </DialogClose>
            <Button
              onClick={() => {
                try {
                  applyCallbackRef.current(dialogValue);
                } finally {
                  setDialogOpen(false);
                }
              }}
            >
              درج
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
