"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { Input } from "./ui/input";

interface ImagePromptInputProps {
  onSubmit: (prompt: string) => void;
  isEditing: boolean;
  isLoading: boolean;
}

export function ImagePromptInput({
  onSubmit,
  isEditing,
  isLoading,
}: ImagePromptInputProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = () => {
    if (prompt.trim()) {
      onSubmit(prompt.trim());
      setPrompt("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg">
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">
          {isEditing
            ? "描述你想要如何编辑这张图片"
            : "描述你想要生成的图片"}
        </p>
      </div>

      <Input
        id="prompt"
        className="border-secondary resize-none"
        placeholder={
          isEditing
            ? "示例：将背景改为蓝色，并添加一道彩虹..."
            : "示例：一只戴着高顶礼帽、长着翅膀的猪在未来城市上空飞翔的3D渲染图..."
        }
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <Button
        type="submit"
        disabled={!prompt.trim() || isLoading}
        className="w-full bg-primary hover:bg-primary/90"
      >
        <Wand2 className="w-4 h-4 mr-2" />
        {isEditing ? "Edit Image" : "Generate Image"}
      </Button>
    </form>
  );
}
