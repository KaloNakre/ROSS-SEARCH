import React, { useRef, useState } from 'react';
import { Upload, RefreshCw, Trash2, ImageOff, CheckCircle2 } from 'lucide-react';
import NeutralAvatar from './NeutralAvatar';

export const ImageUploadWidget = ({
  currentImage,
  onImageChange,
  label = "Profile Picture (Optional)"
}) => {
  const fileInputRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setErrorMessage('');
    setSuccessMessage('');

    if (!file) return;

    // Validate type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrorMessage('Please upload a valid image file (JPEG, PNG, or WebP).');
      return;
    }

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 2MB limit. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onImageChange(reader.result);
      setSuccessMessage('Image loaded successfully for preview.');
      setTimeout(() => setSuccessMessage(''), 3000);
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setSuccessMessage('Profile photo removed. Reverted to neutral placeholder.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* Preview Container */}
        <div className="flex flex-col items-center">
          <NeutralAvatar
            src={currentImage}
            size="xl"
            showLabel={!currentImage}
            className="w-32 h-32 rounded-2xl shadow-sm"
          />
          <span className="text-xs text-slate-400 mt-2">
            {currentImage ? "Custom Preview" : "Neutral Placeholder"}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex-1 space-y-3 text-center sm:text-left">
          <div>
            <h4 className="text-sm font-semibold text-slate-800">{label}</h4>
            <p className="text-xs text-slate-500 mt-1">
              Upload a clear photo for identification. In compliance with privacy guidelines, a neutral placeholder is shown if none is supplied.
            </p>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
            {!currentImage ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
              >
                <Upload size={14} /> Upload Picture
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                >
                  <RefreshCw size={14} /> Replace Picture
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-medium rounded-lg transition-colors border border-rose-200"
                >
                  <Trash2 size={14} /> Remove Picture
                </button>
              </>
            )}
          </div>

          {errorMessage && (
            <p className="text-xs text-rose-600 font-medium">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 size={13} /> {successMessage}
            </p>
          )}

          <div className="text-[11px] text-slate-400">
            JPG, PNG or WebP up to 2MB. Square format recommended.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadWidget;

