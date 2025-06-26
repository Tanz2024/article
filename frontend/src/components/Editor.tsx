"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";

export default function Editor({ value, onChange }: { value?: string; onChange?: (content: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "<p>Start writing your article...</p>",
    onUpdate: ({ editor }) => {
      if (onChange) onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert max-w-none min-h-[300px] p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none text-base sm:text-lg transition-all duration-200 shadow-sm",
      },
    },
  });

  return (
    <div className="w-full">
      <EditorContent editor={editor} />
    </div>
  );
}
