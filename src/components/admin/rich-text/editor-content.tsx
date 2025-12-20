"use client";

import { Editor, EditorContent } from "@tiptap/react";

interface EditorContentProps {
  editor: Editor;
  placeholder: string;
}

export function RichTextEditorContent({
  editor,
  placeholder,
}: EditorContentProps) {
  return (
    <div className="relative">
      <EditorContent editor={editor} />
      {editor.isEmpty && (
        <div className="absolute top-3 start-3 text-muted-foreground pointer-events-none text-sm">
          {placeholder}
        </div>
      )}
    </div>
  );
}
