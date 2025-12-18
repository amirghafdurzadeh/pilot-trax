import { Editor } from "@tiptap/react";
import { Mathematics } from "@tiptap/extension-mathematics";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";

function createMathExtension(
  editorRef: React.MutableRefObject<Editor | null>,
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

export const getEditorExtensions = (
  editorRef: React.MutableRefObject<Editor | null>,
  showDialog: (
    initial: string,
    mode: "inline" | "block",
    apply: (latex: string) => void
  ) => void
) => [
  StarterKit,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Image.configure({
    HTMLAttributes: {
      class: "max-w-full h-auto rounded",
    },
  }),
  createMathExtension(editorRef, showDialog),
];
