"use client";

import { useEffect, useRef } from "react";

export function EditableText({
  text,
  onUpdate,
  isEditable = false,
  as: Tag = "span",
  className = "",
}: {
  text: string;
  onUpdate: (val: string) => void;
  isEditable?: boolean;
  as?: any;
  className?: string;
}) {
  const textRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (
      textRef.current &&
      textRef.current.textContent !== text
    ) {
      textRef.current.textContent = text;
    }
  }, [text]);

  const handleBlur = () => {
    if (textRef.current) {
      const newText =
        textRef.current.textContent || "";

      if (newText !== text) {
        onUpdate(newText);
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent
  ) => {
    if (e.key === "Enter" && Tag !== "p") {
      e.preventDefault();
      textRef.current?.blur();
    }
  };

  return (
    <Tag
      ref={textRef}
      contentEditable={isEditable}
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`inline-block align-baseline overflow-visible leading-[1.2] pb-[0.08em] ${className} ${isEditable ? `outline-none cursor-text transition-all duration-300 ease-out  hover:bg-[#b8924a]/10 focus:bg-white/60 focus:shadow-[0_0_0_1px_rgba(184,146,74,0.3)] rounded-md px-1.5 -mx-1.5 py-1` : ""}`}
    >
      {text}
    </Tag>
  );
}