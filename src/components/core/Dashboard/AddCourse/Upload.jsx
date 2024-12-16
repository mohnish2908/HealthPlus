import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";
import { Player } from "video-react";

import "video-react/dist/video-react.css";

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(
    viewData ? viewData : editData ? editData : ""
  );
  const inputRef = useRef(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      previewFile(file);
      setSelectedFile(file);
      setValue(name, file); // Update the form value
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: !video
      ? { "image/*": [".jpeg", ".jpg", ".png"] }
      : { "video/*": [".mp4"] },
    onDrop,
  });

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleManualUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      previewFile(file);
      setSelectedFile(file);
      setValue(name, file); // Update the form value
    }
  };

  useEffect(() => {
    register(name, { required: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register]);

  useEffect(() => {
    setValue(name, selectedFile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile, setValue]);

  return (
    <div className="flex flex-col space-y-4">
      {/* Label */}
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} {!viewData && <sup className="text-pink-200">*</sup>}
      </label>

      {/* Conditional Rendering for Preview or Dropzone */}
      {previewSource ? (
        <div className="mt-4 flex justify-center">
          {!video ? (
            <img
              src={previewSource}
              alt="Preview"
              className="h-40 w-40 rounded-md object-cover border border-gray-500"
            />
          ) : (
            <Player>
              <source src={previewSource} />
            </Player>
          )}
        </div>
      ) : (
        <div
          className={`${
            isDragActive ? "bg-richblack-600" : "bg-richblack-700"
          } flex min-h-[200px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center text-center">
            <FiUploadCloud className="text-2xl text-yellow-50" />
            <p className="mt-2 text-sm text-richblack-200">
              Drag and drop an {!video ? "image" : "video"}, or{" "}
              <span className="font-semibold text-yellow-50">
                click to browse
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Manual Upload Button */}
      <div className="flex items-center justify-start">
        <button
          type="button"
          onClick={() => inputRef.current.click()}
          className="bg-blue-500 px-4 py-2 text-sm text-white rounded-md"
        >
          Select File
        </button>
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept={!video ? "image/*" : "video/*"}
          onChange={handleManualUpload}
        />
      </div>

      {/* Error Message */}
      {errors[name] && (
        <span className="text-xs text-pink-200">
          {errors[name]?.message || `${label} is required`}
        </span>
      )}
    </div>
  );
}
