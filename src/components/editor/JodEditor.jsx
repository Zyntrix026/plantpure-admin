import React, { useMemo, useRef } from "react";
import JoditEditor from "jodit-react";

const JodEditor = ({ value, onChange }) => {
  const editor = useRef(null);

  const config = useMemo(
    () => ({
      readonly: false,
      height: 400,
      toolbarAdaptive: false,
      toolbarSticky: true,
      placeholder: 'Start typing like MS Word...',
      enter: "p",
      fontsize: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72],
      
      buttons: [
        "source", "|",
        "bold", "italic", "underline", "strikethrough", "|",
        "font", "fontsize", "brush", "paragraph", "|",
        "align", 
        {
          name: "ul",
          list: {
            disc: "Default (Dot)",
            circle: "Circle",
            square: "Square",
          }
        },
        {
          name: "ol",
          list: {
            decimal: "1, 2, 3",
            "lower-alpha": "a, b, c",
            "upper-alpha": "A, B, C",
            "lower-roman": "i, ii, iii",
            "upper-roman": "I, II, III",
          }
        },
        "|",
        "image", "table", "link", "hr", "|",
        "undo", "redo", "eraser", "fullsize"
      ],
      
      controls: {
        paragraph: {
          list: {
            p: "Normal Text",
            h1: "Heading 1",
            h2: "Heading 2",
            h3: "Heading 3",
            h4: "Heading 4",
            h5: "Heading 5",
            h6: "Heading 6",
          }
        }
      },
    }),
    []
  );

  return (
    <div className="word-style-editor border rounded-md">
      <style>{`
        /* Heading Hierarchy Styling */
        .jodit-wysiwyg h1 { font-size: 2.25rem !important; font-weight: 800 !important; line-height: 1.2; margin-bottom: 1rem; }
        .jodit-wysiwyg h2 { font-size: 1.875rem !important; font-weight: 700 !important; line-height: 1.25; margin-bottom: 0.75rem; }
        .jodit-wysiwyg h3 { font-size: 1.5rem !important; font-weight: 600 !important; line-height: 1.3; margin-bottom: 0.5rem; }
        .jodit-wysiwyg h4 { font-size: 1.25rem !important; font-weight: 600 !important; }
        .jodit-wysiwyg h5 { font-size: 1.125rem !important; font-weight: 600 !important; }
        .jodit-wysiwyg h6 { font-size: 1rem !important; font-weight: 600 !important; }

        /* List Styling & Types */
        .jodit-wysiwyg ul { list-style-type: disc !important; padding-left: 40px !important; }
        .jodit-wysiwyg ol { list-style-type: decimal !important; padding-left: 40px !important; }
        
        .jodit-wysiwyg ol[style*="list-style-type: lower-alpha"] { list-style-type: lower-alpha !important; }
        .jodit-wysiwyg ol[style*="list-style-type: upper-alpha"] { list-style-type: upper-alpha !important; }
        .jodit-wysiwyg ol[style*="list-style-type: lower-roman"] { list-style-type: lower-roman !important; }
        .jodit-wysiwyg ol[style*="list-style-type: upper-roman"] { list-style-type: upper-roman !important; }
        
        .jodit-wysiwyg ul[style*="list-style-type: circle"] { list-style-type: circle !important; }
        .jodit-wysiwyg ul[style*="list-style-type: square"] { list-style-type: square !important; }

        /* General editor spacing */
        .jodit-wysiwyg p { margin-bottom: 1rem; }
      `}</style>
      <JoditEditor
        ref={editor}
        value={value}
        config={config}
        onBlur={(newContent) => onChange(newContent)}
      />
    </div>
  );
};

export default JodEditor;