"use client";

import Image from "@tiptap/extension-image";
import { Mathematics } from "@tiptap/extension-mathematics";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { BoldIcon, ImageIcon, ItalicIcon, SigmaIcon } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "katex/dist/katex.min.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

function createMathExtension(editorRef: React.MutableRefObject<Editor | null>) {
  return Mathematics.configure({
    inlineOptions: {
      onClick: (node, pos) => {
        const currentEditor = editorRef.current;
        if (!currentEditor) return;
        const latex = prompt("فرمول LaTeX را وارد کنید:", node.attrs.latex);
        if (latex !== null) {
          currentEditor
            .chain()
            .setNodeSelection(pos)
            .updateInlineMath({ latex })
            .focus()
            .run();
        }
      },
    },
    blockOptions: {
      onClick: (node, pos) => {
        const currentEditor = editorRef.current;
        if (!currentEditor) return;
        const latex = prompt("فرمول LaTeX را وارد کنید:", node.attrs.latex);
        if (latex !== null) {
          currentEditor
            .chain()
            .setNodeSelection(pos)
            .updateBlockMath({ latex })
            .focus()
            .run();
        }
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

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded",
        },
      }),
      createMathExtension(editorRef),
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
    const url = prompt("آدرس تصویر را وارد کنید:");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleInsertMath = () => {
    const latex = prompt("فرمول LaTeX را وارد کنید:", "x^2 + y^2 = z^2");
    if (latex && editor) {
      editor.chain().focus().insertInlineMath({ latex }).run();
    }
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
    </div>
  );
}
