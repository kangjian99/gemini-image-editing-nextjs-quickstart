"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { Upload as UploadIcon, Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";
interface ImageUploadProps {
  onImageSelect: (imageData: string) => void;
  currentImage: string | null;
}

const MAX_UPLOAD_SIZE = process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE 
  ? parseInt(process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE, 10) 
  : 5; // 默认MB

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
}

export function ImageUpload({ onImageSelect, currentImage }: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Update the selected file when the current image changes
  useEffect(() => {
    if (!currentImage) {
      setSelectedFile(null);
    }
  }, [currentImage]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setSelectedFile(file);

      // Convert the file to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const result = event.target.result as string;
          console.log("Image loaded, length:", result.length);
          onImageSelect(result);
        }
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxSize: MAX_UPLOAD_SIZE * 1024 * 1024,
    multiple: false,
  });

  const handleRemove = () => {
    setSelectedFile(null);
    onImageSelect("");
  };

  return (
    <div className="w-full">
      {!currentImage ? (
        <div
          {...getRootProps()}
          className={`min-h-[150px] p-4 rounded-lg
          ${isDragActive ? "bg-secondary/50" : "bg-secondary"}
          transition-colors duration-200 ease-in-out hover:bg-secondary/50
          border-2 border-dashed border-secondary
          cursor-pointer flex items-center justify-center gap-4
        `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-row items-center">
            <UploadIcon className="w-8 h-8 text-primary mr-3 flex-shrink-0" />
            <div className="">
              <p className="text-sm font-medium text-foreground">
              拖放你的图片到这里，或点击选择图片上传
              </p>
              <p className="text-xs text-muted-foreground">
                Maximum file size: 5MB
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center p-4 rounded-lg bg-secondary">
          <div className="flex w-full items-center mb-4">
            <ImageIcon className="w-8 h-8 text-primary mr-3 flex-shrink-0" />
            <div className="flex-grow min-w-0">
              <p className="text-sm font-medium truncate text-foreground">
                {selectedFile?.name || "Current Image"}
              </p>
              {selectedFile && (
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile?.size ?? 0)}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="flex-shrink-0 ml-2"
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Remove image</span>
            </Button>
          </div>
          <div className="w-full overflow-hidden rounded-md relative aspect-video">
            <Image
              src={currentImage}
              alt="Selected"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}
