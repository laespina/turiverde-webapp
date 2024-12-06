import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadImage } from '../services/storage';
import toast from 'react-hot-toast';
import { Button } from './ui/button';

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  folder?: string;
  maxFiles?: number;
  maxSize?: number; // in MB
}

export function ImageUpload({ 
  onUploadComplete, 
  folder = 'services',
  maxFiles = 10,
  maxSize = 5 // 5MB
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File) => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error(`${file.name} não é uma imagem válida`);
      return false;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`${file.name} excede o tamanho máximo de ${maxSize}MB`);
      return false;
    }

    return true;
  };

  const handleFiles = async (files: File[]) => {
    const validFiles = Array.from(files).filter(validateFile);

    if (validFiles.length === 0) return;

    if (validFiles.length > maxFiles) {
      toast.error(`Você pode enviar no máximo ${maxFiles} imagens`);
      return;
    }

    setUploading(true);

    for (const file of validFiles) {
      try {
        // Initialize progress for this file
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

        const path = `${folder}/${Date.now()}-${file.name}`;
        const url = await uploadImage(file, path);

        // Update progress to complete
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));

        onUploadComplete(url);
        toast.success(`${file.name} enviada com sucesso!`);
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`Erro ao enviar ${file.name}`);
      } finally {
        // Remove progress after a delay
        setTimeout(() => {
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[file.name];
            return newProgress;
          });
        }, 1000);
      }
    }

    setUploading(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    await handleFiles(files);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await handleFiles(files);
  };

  return (
    <div className="space-y-4">
      <div 
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-all
          ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-3 bg-primary/10 rounded-full">
            {uploading ? (
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            ) : (
              <Upload className="w-6 h-6 text-primary" />
            )}
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-primary">Clique para enviar</span> ou arraste e solte
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG ou JPEG (máx. {maxSize}MB)
            </p>
            <p className="text-xs text-gray-500">
              Máximo de {maxFiles} imagens
            </p>
          </div>

          {!uploading && (
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
              className="mt-4"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Selecionar Imagens
            </Button>
          )}
        </div>

        {/* Upload Progress */}
        {Object.entries(uploadProgress).length > 0 && (
          <div className="absolute inset-x-0 bottom-0 p-4 bg-white/90">
            <div className="space-y-2">
              {Object.entries(uploadProgress).map(([fileName, progress]) => (
                <div key={fileName} className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span className="truncate">{fileName}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  {progress === 100 && (
                    <X 
                      className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadProgress(prev => {
                          const newProgress = { ...prev };
                          delete newProgress[fileName];
                          return newProgress;
                        });
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}