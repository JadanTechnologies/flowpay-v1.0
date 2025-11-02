import React, { useRef, useEffect, useState } from 'react';
import { X, Loader } from 'lucide-react';

interface BarcodeScannerModalProps {
  onClose: () => void;
  onScanSuccess: (scannedValue: string) => void;
}

const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({ onClose, onScanSuccess }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationFrameId: number | null = null;

    const startScan = async () => {
      if (!('BarcodeDetector' in window)) {
        setError('Barcode Detector is not supported by this browser.');
        setLoading(false);
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setLoading(false);
        }

        const barcodeDetector = new (window as any).BarcodeDetector({
            formats: ['ean_13', 'code_128', 'qr_code', 'upc_a', 'upc_e', 'ean_8']
        });
        
        const detectBarcode = async () => {
          if (videoRef.current && !videoRef.current.paused && !videoRef.current.ended) {
            try {
                const barcodes = await barcodeDetector.detect(videoRef.current);
                if (barcodes.length > 0) {
                  onScanSuccess(barcodes[0].rawValue);
                } else {
                  animationFrameId = requestAnimationFrame(detectBarcode);
                }
            } catch (err) {
                console.error("Error detecting barcode:", err);
                animationFrameId = requestAnimationFrame(detectBarcode);
            }
          }
        };
        detectBarcode();

      } catch (err: any) {
        setLoading(false);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('Camera access was denied. Please enable it in your browser settings.');
        } else {
          setError('Could not access the camera. Please ensure it is not in use by another application.');
        }
        console.error(err);
      }
    };

    startScan();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onScanSuccess]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-surface rounded-xl shadow-lg w-full max-w-lg border border-border" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-xl font-bold text-text-primary">Scan Product Barcode</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary"><X size={24} /></button>
        </div>
        <div className="p-4 relative aspect-video bg-background">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Loader className="animate-spin text-primary" size={40} />
              <p className="mt-2 text-text-secondary">Starting camera...</p>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <p className="text-red-400">{error}</p>
            </div>
          )}
          <video ref={videoRef} className={`w-full h-full object-cover rounded-md ${loading || error ? 'hidden' : ''}`} playsInline />
          {!loading && !error && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[90%] h-1/2 border-4 border-dashed border-primary/50 rounded-lg" />
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarcodeScannerModal;