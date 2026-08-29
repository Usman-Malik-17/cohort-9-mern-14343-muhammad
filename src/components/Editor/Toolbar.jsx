import React, { useState } from "react";
import { useEditorState } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  ChevronDown,
} from "lucide-react";

function IconButton({ children, active, onClick, title }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 transition-colors ${
        active ? "bg-gray-100 text-gray-900" : ""
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-1 h-5 w-px bg-gray-200" />;
}

function Toolbar({ editor }) {
  const {
    isBold,
    isItalic,
    isUnderline,
    isBulletList,
    isOrderedList,
    isParagraph,
    isHeading1,
    isHeading2,
    isHeading3,
  } = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isBold: editor?.isActive("bold") ?? false,
      isItalic: editor?.isActive("italic") ?? false,
      isUnderline: editor?.isActive("underline") ?? false,
      isBulletList: editor?.isActive("bulletList") ?? false,
      isOrderedList: editor?.isActive("orderedList") ?? false,
      isParagraph: editor?.isActive("paragraph") ?? false,
      isHeading1: editor?.isActive("heading", { level: 1 }) ?? false,
      isHeading2: editor?.isActive("heading", { level: 2 }) ?? false,
      isHeading3: editor?.isActive("heading", { level: 3 }) ?? false,
    }),
  });
  const [tagOptions, setTagOptions] = useState(false);
  const currentTextStyle = isHeading1
    ? "Heading 1"
    : isHeading2
      ? "Heading 2"
      : isHeading3
        ? "Heading 3"
        : "Paragraph";
  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-gray-200 bg-white px-2 py-1.5 shadow-sm w-fit">
      <IconButton
        title="Bold"
        active={isBold}
        onClick={() => {
          editor?.chain().focus().toggleBold().run();
        }}
      >
        <Bold className="h-4 w-4 cursor-pointer" />
      </IconButton>
      <IconButton
        title="Italic"
        active={isItalic}
        onClick={() => {
          editor?.chain().focus().toggleItalic().run();
        }}
      >
        <Italic className="h-4 w-4 cursor-pointer" />
      </IconButton>
      <IconButton
        title="Underline"
        active={isUnderline}
        onClick={() => {
          editor?.chain().focus().toggleUnderline().run();
        }}
      >
        <Underline className="h-4 w-4 cursor-pointer" />
      </IconButton>

      <Divider />

      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setTagOptions((prev) => !prev);
          }}
          className=" flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
        >
          {currentTextStyle}
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        </button>
        <div
          className={`absolute left-0 top-full z-10 mt-1 w-40 rounded-md border bg-white p-1 shadow-lg ${tagOptions ? "block" : "hidden"}`}
        >
          <button
            type="button"
            active={isParagraph}
            onClick={() => {
              editor?.chain().focus().setParagraph().run();
              setTagOptions(false);
            }}
            className={`block w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100 cursor-pointer ${
              isParagraph ? "bg-gray-100 text-gray-900" : ""
            }`}
          >
            Paragraph
          </button>

          <button
            type="button"
            active={isHeading1}
            onClick={() => {
              editor?.chain().focus().toggleHeading({ level: 1 }).run();
              setTagOptions(false);
            }}
            className={`block w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100 cursor-pointer ${
              isHeading1 ? "bg-gray-100 text-gray-900" : ""
            }`}
          >
            Heading 1
          </button>

          <button
            type="button"
            active={isHeading2}
            onClick={() => {
              editor?.chain().focus().toggleHeading({ level: 2 }).run();
              setTagOptions(false);
            }}
            className={`block w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100 cursor-pointer ${
              isHeading2 ? "bg-gray-100 text-gray-900" : ""
            }`}
          >
            Heading 2
          </button>

          <button
            type="button"
            active={isHeading3}
            onClick={() => {
              editor?.chain().focus().toggleHeading({ level: 3 }).run();
              setTagOptions(false);
            }}
            className={`block w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100 cursor-pointer ${
              isHeading3 ? "bg-gray-100 text-gray-900" : ""
            }`}
          >
            Heading 3
          </button>
        </div>
      </div>

      <Divider />

      <IconButton
        title="Bulleted list"
        active={isBulletList}
        onClick={() => {
          editor?.chain().focus().toggleBulletList().run();
        }}
      >
        <List className="h-4 w-4 cursor-pointer" />
      </IconButton>
      <IconButton
        title="Numbered list"
        active={isOrderedList}
        onClick={() => {
          editor?.chain().focus().toggleOrderedList().run();
        }}
      >
        <ListOrdered className="h-4 w-4 cursor-pointer" />
      </IconButton>
    </div>
  );
}

export default Toolbar;
