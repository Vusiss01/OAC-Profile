import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Upload,
  X,
  FileText,
  Search,
  Plus,
  FolderPlus,
  Download,
  Share2,
  ChevronDown,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  preview?: string;
  status: "uploading" | "success" | "error";
  errorMessage?: string;
}

interface DocumentUploadProps {
  participantId?: string;
  documentTypes?: Array<{ id: string; name: string; required: boolean }>;
  onUploadComplete?: (files: DocumentFile[]) => void;
}

const DocumentUpload = ({
  participantId = "123",
  documentTypes = [
    { id: "id", name: "ID Document", required: true },
    { id: "payment", name: "Payment Proof", required: true },
    { id: "medical", name: "Medical Information", required: false },
    { id: "consent", name: "Consent Form", required: true },
  ],
  onUploadComplete = () => {},
}: DocumentUploadProps) => {
  const [activeTab, setActiveTab] = useState("id");
  const [files, setFiles] = useState<Record<string, DocumentFile[]>>(
    documentTypes.reduce(
      (acc, type) => ({
        ...acc,
        [type.id]: [],
      }),
      {},
    ),
  );
  const [showStarred, setShowStarred] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    documentType: string,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => {
        const id = `${Date.now()}-${file.name}`;
        const reader = new FileReader();

        // Create a preview for image files
        let preview;
        if (file.type.startsWith("image/")) {
          reader.onload = () => {
            const updatedFiles = [...files[documentType]];
            const fileIndex = updatedFiles.findIndex((f) => f.id === id);
            if (fileIndex !== -1) {
              updatedFiles[fileIndex] = {
                ...updatedFiles[fileIndex],
                preview: reader.result as string,
              };
              setFiles((prev) => ({
                ...prev,
                [documentType]: updatedFiles,
              }));
            }
          };
          reader.readAsDataURL(file);
        }

        return {
          id,
          name: file.name,
          size: file.size,
          type: file.type,
          preview,
          status: "success", // Simulating successful upload
        };
      });

      setFiles((prev) => ({
        ...prev,
        [documentType]: [...prev[documentType], ...newFiles],
      }));

      // Simulate upload complete callback
      setTimeout(() => {
        onUploadComplete(newFiles);
      }, 1000);
    }
  };

  const removeFile = (documentType: string, fileId: string) => {
    setFiles((prev) => ({
      ...prev,
      [documentType]: prev[documentType].filter((file) => file.id !== fileId),
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex h-screen w-full bg-white">
      {/* Left sidebar */}
      <div className="w-64 border-r border-gray-200 flex flex-col">
        {/* Dropbox logo */}
        <div className="p-4 border-b border-gray-200">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="#0061FF">
            <path d="M6 2h12l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path>
          </svg>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
              </svg>
              <span className="font-medium">Home</span>
            </div>
          </div>

          <div className="p-2">
            <button className="w-full flex items-center space-x-3 p-2 rounded-md bg-gray-100 font-medium">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"></path>
              </svg>
              <span>All files</span>
            </button>

            <button className="w-full flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"></path>
              </svg>
              <span>Photos</span>
            </button>

            <button className="w-full flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path>
              </svg>
              <span>Shared</span>
            </button>

            <button className="w-full flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z"></path>
              </svg>
              <span>Signatures</span>
            </button>

            <button className="w-full flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path d="M11 7H2v2h9V7zm0 8H2v2h9v-2zm5.34-4L12.8 7.46l1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41L16.34 11zm0 8l-3.54-3.54 1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41L16.34 19z"></path>
              </svg>
              <span>File requests</span>
            </button>

            <button className="w-full flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
              </svg>
              <span>Deleted files</span>
            </button>
          </div>

          <div className="p-2 mt-4">
            <div className="flex items-center justify-between p-2">
              <span className="text-xs font-semibold text-gray-500 uppercase">
                Quick access
              </span>
              <button className="text-gray-500 hover:bg-gray-100 p-1 rounded">
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="p-2 mt-2">
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center">
                <ChevronDown size={16} className="text-gray-500 mr-2" />
                <span className="text-sm font-medium">Starred</span>
              </div>
            </div>
          </div>

          <div className="p-2">
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center">
                <ChevronDown size={16} className="text-gray-500 mr-2" />
                <span className="text-sm font-medium">Document Types</span>
              </div>
            </div>
            <div className="ml-6 space-y-1">
              {documentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveTab(type.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-2 rounded-md text-sm",
                    activeTab === type.id
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-100",
                  )}
                >
                  <span className="font-medium">{type.name}</span>
                  {type.required && (
                    <span className="text-xs text-red-500">*</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search"
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center ml-4 space-x-2">
            <Button variant="ghost" size="sm" className="text-gray-600">
              <span className="mr-2">Invite members</span>
            </Button>
            <Button className="bg-green-500 hover:bg-green-600 text-white">
              Click to upgrade
            </Button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex p-4 space-x-2">
          <Button className="bg-gray-800 hover:bg-gray-900 text-white">
            <Upload className="mr-2 h-4 w-4" />
            <span>Upload or drop</span>
          </Button>
          <Button variant="outline">
            <span>Create</span>
          </Button>
          <Button variant="outline">
            <span>Create folder</span>
          </Button>
          <Button variant="outline">
            <span>Get the app</span>
          </Button>
          <Button variant="outline">
            <span>Transfer a copy</span>
          </Button>
          <Button variant="outline">
            <span>Share</span>
          </Button>
        </div>

        {/* Files header */}
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold">All files</h2>
            <Settings size={18} className="ml-2 text-gray-500" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-orange-500 rounded-full text-white">
              <span className="text-xs">vs</span>
            </div>
            <span className="text-sm text-gray-600">Only you</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center px-4 py-2 border-b border-gray-200">
          <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md flex items-center">
            <span>Recents</span>
          </button>
          <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md flex items-center ml-2">
            <span>Starred</span>
          </button>
          <div className="ml-auto flex">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1 rounded ${viewMode === "list" ? "bg-gray-200" : ""}`}
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path d="M3 13h18v-2H3v2zm0 7h18v-2H3v2zm0-14h18V4H3v2z"></path>
              </svg>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1 rounded ml-1 ${viewMode === "grid" ? "bg-gray-200" : ""}`}
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path d="M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Main content area with tabs */}
        <div className="flex-1 overflow-auto p-4">
          <Tabs value={activeTab} className="w-full">
            {documentTypes.map((type) => (
              <TabsContent key={type.id} value={type.id} className="mt-0">
                {files[type.id].length === 0 ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center h-64 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-12 w-12 text-gray-300" />
                      <h3 className="text-lg font-medium mt-2 text-gray-700">
                        Drop files here to upload
                      </h3>
                      <p className="text-sm text-gray-500 max-w-md mx-auto mt-1">
                        Drag and drop files here, or click the upload button
                      </p>
                      <Button
                        onClick={() =>
                          document
                            .getElementById(`file-upload-${type.id}`)
                            ?.click()
                        }
                        className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800"
                      >
                        Upload
                      </Button>
                      <Input
                        id={`file-upload-${type.id}`}
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, type.id)}
                        accept=".pdf,.jpg,.jpeg,.png"
                        multiple
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {files[type.id].map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {file.preview ? (
                            <img
                              src={file.preview}
                              alt={file.name}
                              className="h-10 w-10 rounded object-cover"
                            />
                          ) : (
                            <FileText className="h-10 w-10 text-blue-500" />
                          )}
                          <div>
                            <p className="text-sm font-medium truncate max-w-[200px]">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Uploaded {new Date().toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 w-24">
                          {formatFileSize(file.size)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Download className="h-4 w-4 text-gray-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Share2 className="h-4 w-4 text-gray-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFile(type.id, file.id)}
                            className="h-8 w-8"
                          >
                            <X className="h-4 w-4 text-gray-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-orange-500 rounded-full text-white">
              <span className="text-xs">vs</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium">Get started</span>
              <span className="ml-2 text-xs bg-gray-200 px-1.5 py-0.5 rounded">
                0%
              </span>
            </div>
          </div>
          <span className="text-xs text-gray-500">Add a file or folder</span>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
