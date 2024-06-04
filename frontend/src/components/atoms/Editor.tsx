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
  linkDialogPlugin,
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
    <div className="border border-gray-300 border-solid rounded-md bg-[#f0f0f3]">
      <MDXEditor
        contentEditableClassName="bg-white rounded-b-md"
        ref={editorRef}
        onChange={onChange}
        markdown={markdown}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          markdownShortcutPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
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
    </div>
  );
};

export default Editor;
