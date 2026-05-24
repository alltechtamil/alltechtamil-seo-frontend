"use client";

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';

// Integrated Asset Manager
import { ImagePicker } from './ImagePicker';
import { useImageUpload } from '@/hooks/useImageUpload';

// Lucide toolbar icons
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Terminal,
  Eraser,
  Code2,
  X,
  UploadCloud,
  Loader2
} from 'lucide-react';

// Create syntax highlight instance using common languages
const lowlight = createLowlight(common);

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [isRawMode, setIsRawMode] = useState(false);
  
  // Image Manager Modal State
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [manualImageUrl, setManualImageUrl] = useState('');
  const { upload, isUploading, error: uploadError } = useImageUpload();

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        // Disable default code block to use syntax highlighting instead
        codeBlock: false,
        // Disable starter kit link to prevent duplication with our custom Link override
        link: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline font-medium hover:text-primary/80 transition-colors',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-2xl max-w-full my-6 border border-outline-variant/30 shadow-md mx-auto block',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Write your rich technical blog post content here...',
        emptyNodeClass: 'before:content-[attr(data-placeholder)] before:float-left before:text-on-surface-variant/40 before:pointer-events-none before:h-0',
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'rounded-2xl p-4 bg-surface-container-low font-mono text-xs text-on-surface overflow-x-auto my-6 border border-outline-variant/40 shadow-inner',
        },
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      // Only fire TipTap updates if we are actively using the Rich Text UI
      if (!isRawMode) {
        onChange(editor.getHTML());
      }
    },
  });

  // Sync content dynamically. When switching FROM Raw Mode TO Rich Text, this hydrates the TipTap engine.
  useEffect(() => {
    if (editor && !isRawMode && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor, isRawMode]);

  if (!editor) {
    return (
      <div className="w-full border border-outline-variant/40 rounded-2xl bg-surface-container-lowest animate-pulse h-96" />
    );
  }

  // Action: Prompt for user Link inclusion
  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter target URL:', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  // Image Manager Actions
  const handleImageSelect = (url: string) => {
    editor.chain().focus().setImage({ src: url }).run();
    setIsImageModalOpen(false);
    setManualImageUrl('');
  };

  const handleManualImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualImageUrl) {
      handleImageSelect(manualImageUrl);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const cdnUrl = await upload(file);
      if (cdnUrl) {
        handleImageSelect(cdnUrl);
      }
    } catch (err) {
      // Errors are caught and surfaced via uploadError by the hook
    }
  };

  return (
    <div className="w-full border border-outline-variant/50 rounded-2xl bg-surface-container-lowest overflow-hidden shadow-inner flex flex-col min-h-[480px] relative">
      
      {/* Editorial Toolbar Header Panel */}
      <div className="p-3 bg-surface-container-low border-b border-outline-variant/30 flex flex-wrap items-center gap-1.5 select-none relative z-10">
        
        {!isRawMode && (
          <>
            {/* Undo & Redo */}
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent"
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent"
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-outline-variant/40 mx-1" />

            {/* Font Formats: Headings */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive('heading', { level: 1 }) 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive('heading', { level: 2 }) 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive('heading', { level: 3 }) 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-outline-variant/40 mx-1" />

            {/* Text Decoration */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive('bold') 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive('italic') 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive('strike') 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
              title="Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-outline-variant/40 mx-1" />

            {/* Paragraph Structures */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive('bulletList') 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive('orderedList') 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
              title="Ordered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive('blockquote') 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
              title="Blockquote"
            >
              <Quote className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-outline-variant/40 mx-1" />

            {/* Code & Tech Modules */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive('code') 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
              title="Inline Code"
            >
              <Code className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive('codeBlock') 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
              title="Syntax Code Block"
            >
              <Terminal className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-outline-variant/40 mx-1" />

            {/* Hyperlinks & Media */}
            <button
              type="button"
              onClick={setLink}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive('link') 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
              title="Add Hyperlink"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetLink().run()}
              disabled={!editor.isActive('link')}
              className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent"
              title="Remove Hyperlink"
            >
              <Unlink className="w-4 h-4" />
            </button>
            
            {/* NEW: Open Image Manager Modal */}
            <button
              type="button"
              onClick={() => setIsImageModalOpen(true)}
              className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-all"
              title="Insert Image via Asset Manager"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-outline-variant/40 mx-1" />

            {/* Formatting Clear */}
            <button
              type="button"
              onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
              className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-all"
              title="Clear Format Styling"
            >
              <Eraser className="w-4 h-4" />
            </button>
          </>
        )}

        {/* System Toggle: Raw HTML Mode */}
        <div className="ml-auto flex items-center">
          <button
            type="button"
            onClick={() => setIsRawMode(!isRawMode)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${
              isRawMode 
                ? 'bg-primary/10 text-primary border-primary/30' 
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border-transparent'
            }`}
            title="Toggle Raw HTML Edit Mode"
          >
            <Code2 className="w-4 h-4" />
            {isRawMode ? 'Raw HTML' : 'Rich Text'}
          </button>
        </div>

      </div>

      {/* Editor Content Display */}
      {isRawMode ? (
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="<p>Write your raw technical HTML here...</p>"
          className="p-5 flex-1 w-full bg-surface-container-lowest text-on-surface font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-0 min-h-[380px]"
          spellCheck={false}
        />
      ) : (
        <div className="p-5 flex-1 flex flex-col min-h-[380px] overflow-y-auto text-on-surface relative z-0">
          <EditorContent 
            editor={editor} 
            className="prose prose-sm md:prose-base dark:prose-invert max-w-none focus:outline-none outline-none select-text flex-1 
            prose-p:text-on-surface prose-headings:text-on-surface prose-strong:text-on-surface 
            prose-li:text-on-surface prose-blockquote:text-on-surface-variant 
            prose-code:text-primary prose-a:text-primary"
          />
        </div>
      )}

      {/* Embedded Image Manager Modal Overlay */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                Image Manager
              </h3>
              <button 
                onClick={() => setIsImageModalOpen(false)}
                className="p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-error rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Top Toolbar: Upload vs Paste */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 pb-6 border-b border-outline-variant/30">
              
              {/* File Upload Zone */}
              <div className="flex-[1.5] bg-surface-container-low border border-outline-variant/50 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center gap-2 relative hover:bg-primary/5 hover:border-primary/50 transition-colors group">
                {isUploading ? (
                  <>
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    <span className="text-xs font-bold text-primary">Uploading to CDN...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-6 h-6 text-on-surface-variant group-hover:text-primary transition-colors" />
                    <span className="text-sm font-bold text-on-surface">Upload New Image</span>
                    <span className="text-[10px] text-on-surface-variant text-center px-4">Direct integration with Cloudinary. Auto-converts to WebP.</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </>
                )}
                {uploadError && <p className="text-[10px] text-error font-bold text-center mt-1 bg-error/10 px-2 py-0.5 rounded">{uploadError}</p>}
              </div>

              {/* Direct Link Paste Zone */}
              <div className="flex-1 flex flex-col justify-center bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30">
                <form onSubmit={handleManualImageSubmit} className="flex flex-col gap-3">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                    <LinkIcon className="w-3 h-3" />
                    Or Paste Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={manualImageUrl}
                      onChange={(e) => setManualImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    <button 
                      type="submit"
                      disabled={!manualImageUrl}
                      className="bg-primary text-on-primary px-3 py-2 rounded-xl text-xs font-bold disabled:opacity-50 transition-all hover:shadow-md"
                    >
                      Insert
                    </button>
                  </div>
                </form>
              </div>

            </div>

            {/* Asset Library Scroll Container */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">Asset Library</h4>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <ImagePicker onSelect={handleImageSelect} />
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
