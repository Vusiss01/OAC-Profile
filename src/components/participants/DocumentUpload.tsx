import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { X, Upload, FileText } from "lucide-react";

interface DocumentFile {
  file: File;
  preview: string;
}

interface DocumentUploadProps {
  onUpload?: (files: File[]) => void;
  maxSize?: number; // in bytes
  acceptedFileTypes?: string[];
}

const DocumentUpload = ({
  onUpload = () => {},
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedFileTypes = [".pdf", ".jpg", ".jpeg", ".png"],
}: DocumentUploadProps) => {
  const [files, setFiles] = useState<DocumentFile[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setFiles((prev) => [...prev, ...newFiles]);
      onUpload(acceptedFiles);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize,
    multiple: true,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <img src={fileName} alt="preview" className="h-6 w-6 object-cover rounded" />;
      default:
        return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-gray-300 bg-gray-50 hover:bg-gray-100"
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <h4 className="font-medium text-gray-700 mt-2">Upload Documents</h4>
          <p className="text-sm text-gray-500 mt-1">
            {isDragActive
              ? "Drop the files here"
              : "Drag and drop your documents here, or click to browse"}
          </p>
          <Button type="button" variant="outline" className="mt-4">
            Browse Files
          </Button>
          <p className="text-xs text-gray-400 mt-2">
            Supported formats: PDF, JPG, PNG (Max size: {formatFileSize(maxSize)})
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {getFileIcon(file.file.name)}
                  </div>
                          <div>
                  <p className="text-sm font-medium text-gray-900">
                    {file.file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                    {formatFileSize(file.file.size)}
                            </p>
                          </div>
                        </div>
                          <Button
                type="button"
                            variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="h-4 w-4" />
                          </Button>
                      </div>
                    ))}
                  </div>
                )}
    </div>
  );
};

export default DocumentUpload;
