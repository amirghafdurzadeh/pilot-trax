"use client";

import { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  BoldIcon,
  ImageIcon,
  ItalicIcon,
  Languages,
  PilcrowLeft,
  PilcrowRight,
  SigmaIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ToolbarDictionary {
  bold: string;
  italic: string;
  rtl: string;
  ltr: string;
  auto: string;
  align_left: string;
  align_center: string;
  align_right: string;
  align_justify: string;
  insert_image: string;
  insert_math: string;
}

interface ToolbarProps {
  editor: Editor;
  onInsertImage: () => void;
  onInsertMath: () => void;
  dictionary: ToolbarDictionary;
}

export function Toolbar({
  editor,
  onInsertImage,
  onInsertMath,
  dictionary,
}: ToolbarProps) {
  return (
    <div className="flex items-center gap-1 p-1 border-b bg-muted/30 flex-wrap">
      <Button
        type="button"
        variant={editor.isActive("bold") ? "secondary" : "ghost"}
        size="icon"
        className="h-7 w-7"
        onClick={() => editor.chain().focus().toggleBold().run()}
        title={dictionary.bold}
      >
        <BoldIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("italic") ? "secondary" : "ghost"}
        size="icon"
        className="h-7 w-7"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title={dictionary.italic}
      >
        <ItalicIcon className="h-4 w-4" />
      </Button>
      <div className="w-px h-5 bg-border mx-1" />
      <Button
        type="button"
        variant={editor.isActive({ dir: "rtl" }) ? "secondary" : "ghost"}
        size="icon"
        className="h-7 w-7"
        onClick={() => editor.chain().focus().setTextDirection("rtl").run()}
        title={dictionary.rtl}
      >
        <PilcrowLeft className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive({ dir: "ltr" }) ? "secondary" : "ghost"}
        size="icon"
        className="h-7 w-7"
        onClick={() => editor.chain().focus().setTextDirection("ltr").run()}
        title={dictionary.ltr}
      >
        <PilcrowRight className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive({ dir: "auto" }) ? "secondary" : "ghost"}
        size="icon"
        className="h-7 w-7"
        onClick={() => editor.chain().focus().setTextDirection("auto").run()}
        title={dictionary.auto}
      >
        <Languages className="h-4 w-4" />
      </Button>
      <div className="w-px h-5 bg-border mx-1" />
      <Button
        type="button"
        variant={
          editor.isActive({ textAlign: "left" }) ? "secondary" : "ghost"
        }
        size="icon"
        className="h-7 w-7"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        title={dictionary.align_left}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={
          editor.isActive({ textAlign: "center" }) ? "secondary" : "ghost"
        }
        size="icon"
        className="h-7 w-7"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        title={dictionary.align_center}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={
          editor.isActive({ textAlign: "right" }) ? "secondary" : "ghost"
        }
        size="icon"
        className="h-7 w-7"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        title={dictionary.align_right}
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={
          editor.isActive({ textAlign: "justify" }) ? "secondary" : "ghost"
        }
        size="icon"
        className="h-7 w-7"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        title={dictionary.align_justify}
      >
        <AlignJustify className="h-4 w-4" />
      </Button>
      <div className="w-px h-5 bg-border mx-1" />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={onInsertImage}
        title={dictionary.insert_image}
      >
        <ImageIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={onInsertMath}
        title={dictionary.insert_math}
      >
        <SigmaIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
