"use client";
import "@mdxeditor/editor/style.css";
import { FC } from "react";

// Basic editor
import {
  MDXEditor,
  MDXEditorMethods,
  headingsPlugin,
  listsPlugin,
  linkPlugin,
  markdownShortcutPlugin,
} from "@mdxeditor/editor";

// Toolbar
import {
  Separator,
  UndoRedo,
  BoldItalicUnderlineToggles,
  ListsToggle,
  BlockTypeSelect,
  CreateLink,
  toolbarPlugin,
} from "@mdxeditor/editor";

interface EditorProps {
  markdown: string;
  onChange: (e: any) => void;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
}

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs.
 */
const Editor: FC<EditorProps> = ({ markdown, onChange, editorRef }) => {
  return (
    <MDXEditor
      ref={editorRef}
      onChange={onChange}
      markdown={markdown}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              {" "}
              <UndoRedo />
              <Separator />
              <BoldItalicUnderlineToggles />
              <Separator />
              <ListsToggle />
              <Separator />
              <BlockTypeSelect />
              <Separator />
              <CreateLink />
            </>
          ),
        }),
      ]}
    />
  );
};

export default Editor;
