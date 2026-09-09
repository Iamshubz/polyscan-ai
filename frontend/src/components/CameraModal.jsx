import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Check, X, AlertCircle } from 'lucide-react';

const CameraModal = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState('');

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError('');
    setCapturedImage(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('[Camera Access Error]:', err);
      setCameraError('Unable to access camera. Please allow camera permissions or use file upload.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleTakeSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
          const previewUrl = URL.createObjectURL(blob);
          setCapturedImage({ file, previewUrl });
        }
      }, 'image/jpeg', 0.9);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleUsePhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage.file, capturedImage.previewUrl);
      stopCamera();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#DCE5DD]">
        <div className="px-6 py-4 border-b border-[#DCE5DD] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#16803A]" />
            <h3 className="font-bold text-lg text-[#17231C]">Capture Plastic Image</h3>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-lg text-[#66736B] hover:text-[#17231C] hover:bg-[#F5F7F3]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {cameraError ? (
            <div className="p-6 bg-[#B94A48]/10 rounded-2xl border border-[#B94A48]/30 flex flex-col items-center text-center gap-3">
              <AlertCircle className="w-8 h-8 text-[#B94A48]" />
              <p className="text-sm font-medium text-[#B94A48]">{cameraError}</p>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-4/3 flex items-center justify-center">
              {!capturedImage ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={capturedImage.previewUrl}
                  alt="Captured plastic preview"
                  className="w-full h-full object-contain"
                />
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}

          {/* Action controls */}
          {!cameraError && (
            <div className="mt-6 flex items-center justify-center gap-4">
              {!capturedImage ? (
                <button
                  onClick={handleTakeSnapshot}
                  className="flex items-center gap-2 px-6 py-3 bg-[#16803A] text-white rounded-xl font-semibold shadow-md hover:bg-[#14532D] transition-all"
                >
                  <Camera className="w-5 h-5" />
                  Capture Photo
                </button>
              ) : (
                <>
                  <button
                    onClick={handleRetake}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#DCE5DD] text-[#17231C] rounded-xl font-semibold hover:bg-[#F5F7F3] transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retake
                  </button>
                  <button
                    onClick={handleUsePhoto}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#16803A] text-white rounded-xl font-semibold shadow-md hover:bg-[#14532D] transition-all"
                  >
                    <Check className="w-4 h-4" />
                    Use Photo
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraModal;
