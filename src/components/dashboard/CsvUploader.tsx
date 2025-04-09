
import React, { useState } from 'react';
import { Upload, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "sonner";

const CsvUploader = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const droppedFile = files[0];
      if (droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
      } else {
        toast("Invalid file format", {
          description: "Please upload CSV files only.",
          icon: <AlertCircle className="h-4 w-4" />,
        });
      }
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
      } else {
        toast("Invalid file format", {
          description: "Please upload CSV files only.",
          icon: <AlertCircle className="h-4 w-4" />,
        });
      }
    }
  };
  
  const handleUpload = () => {
    if (!file) return;
    
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setFile(null);
      toast("Upload successful", {
        description: "Your CSV file has been processed.",
        icon: <Check className="h-4 w-4" />,
      });
    }, 2000);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Import Data</CardTitle>
        <CardDescription>
          Upload your CSV data from any supported service
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            isDragging ? 'border-insight bg-blue-50' : 'border-border'
          } transition-colors`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Drop your CSV file here</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            or click to browse from your computer
          </p>
          <input
            type="file"
            id="fileInput"
            className="hidden"
            accept=".csv"
            onChange={handleFileChange}
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            Select File
          </Button>
          
          {file && (
            <div className="mt-4 p-3 bg-muted rounded-md flex items-center justify-between">
              <span className="text-sm font-medium truncate max-w-[200px]">
                {file.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={handleUpload}
          disabled={!file || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload CSV'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CsvUploader;
