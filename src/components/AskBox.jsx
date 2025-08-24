import React, { useState, useRef, useCallback, useContext } from "react";
import { Paperclip, ArrowUp, Sparkles, Plus, Mic, Camera } from "lucide-react";
import { cn } from "../utils/utils.js";
import { Button } from "./button.jsx";
import { Context } from "../Context/Context.jsx";

// Professional Chip component with enhanced styling
function Chip({ children, icon, onClick, variant = "default" }) {
  const variants = {
    default: "border-slate-200 bg-white/80 text-slate-600 hover:bg-white hover:border-slate-300 hover:shadow-sm",
    primary: "border-blue-200 bg-blue-50/80 text-blue-700 hover:bg-blue-100/80 hover:border-blue-300"
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200",
        "backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98]",
        variants[variant]
      )}
    >
      {icon && <span className="text-current">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

// Professional Tooltip component
function Tooltip({ children, content }) {
  return (
    <div className="group relative">
      {children}
      <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-slate-900 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
        </div>
      </div>
    </div>
  );
}

export function AskBox({ defaultValue = "" }) {
  const [value, setValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const areaRef = useRef(null);
  const fileInputRef = useRef(null);
  const { onSent } = useContext(Context);

  const submit = useCallback(() => {
    if (value.trim()) {
      onSent(value);
      setValue("");
      areaRef.current?.focus();
    }
  }, [value, onSent]);

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      alert("Only image files are allowed.");
      return;
    }

    console.log("Uploaded image:", file);
  };

  const charCount = value.length;
  const maxChars = 2000;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main input container */}
      <div
        className={cn(
          "relative glass-panel-strong rounded-2xl transition-all duration-300",
          "hover:shadow-2xl",
          isFocused && "ring-2 ring-blue-500/20 shadow-2xl"
        )}
      >
        {/* Content area */}
        <div className="p-4">
          {/* Main textarea */}
          <div className="relative">
            <textarea
              ref={areaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              rows={2}
              maxLength={maxChars}
              placeholder="Ask me anything..."
              className={cn(
                "w-full resize-none bg-transparent text-slate-800 placeholder:text-slate-400",
                "text-sm leading-relaxed focus:outline-none pr-12"
              )}
              aria-label="AI Assistant Prompt"
            />
            
            {/* Floating action button for quick send */}
            {value.trim() && (
              <div className="absolute bottom-1 right-1">
                <Button
                  onClick={submit}
                  size="sm"
                  className="h-7 w-7 rounded-full bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          {/* Action bar */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200/60">
            {/* Left side - Tools */}
            <div className="flex items-center gap-2">
              <Tooltip content="Attach files">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-3.5 w-3.5" />
                </Button>
              </Tooltip>
              
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileUpload}
                hidden
              />

              <Tooltip content="AI Tools">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                </Button>
              </Tooltip>
            </div>

            {/* Right side - Send button and char count */}
            <div className="flex items-center gap-2">
              <div className="text-xs text-slate-500">
                {charCount}/{maxChars}
              </div>
              <Button
                onClick={submit}
                disabled={!value.trim()}
                className={cn(
                  "h-8 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                  "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
                  "shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed",
                  "hover:scale-[1.02] active:scale-[0.98]"
                )}
              >
                <ArrowUp className="h-3.5 w-3.5 mr-1" />
                Send
              </Button>
            </div>
          </div>
        </div>

        {/* Subtle gradient border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-blue-500/10 pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      </div>

      {/* Footer hints */}
      <div className="mt-2 flex items-center justify-center gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <kbd className="px-1 py-0.5 bg-slate-100 rounded text-slate-600 text-xs">⏎</kbd>
          <span>Send</span>
        </div>
        <div className="flex items-center gap-1">
          <kbd className="px-1 py-0.5 bg-slate-100 rounded text-slate-600 text-xs">⇧⏎</kbd>
          <span>New line</span>
        </div>
      </div>
    </div>
  );
}