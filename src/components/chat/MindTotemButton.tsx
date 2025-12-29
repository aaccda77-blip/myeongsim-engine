'use client';

import React, { useState } from 'react';
import { toPng } from 'html-to-image';
import { Download, Loader2, Sparkles } from 'lucide-react';

interface MindTotemButtonProps {
    targetId: string; // The ID of the element to capture (e.g., the result card)
    label?: string;
}

export default function MindTotemButton({ targetId, label = "마인드 토템 저장하기 (Save Mind Totem)" }: MindTotemButtonProps) {
    const [isCapturing, setIsCapturing] = useState(false);

    const handleCapture = async () => {
        setIsCapturing(true);
        try {
            const element = document.getElementById(targetId);
            if (!element) {
                console.error(`Target element #${targetId} not found`);
                return;
            }

            // [Effect] Temporary styling for capture (optional enhancement)
            const originalTransform = element.style.transform;
            element.style.transform = "none"; // Reset scale for clearer capture

            // Use html-to-image for better modern CSS support (e.g. oklab, gradients)
            const dataUrl = await toPng(element, {
                backgroundColor: '#111827', // Force dark background
                cacheBust: true,
                filter: (node) => node.tagName !== 'BUTTON', // Ignore buttons
                style: {
                    transform: 'none',
                    opacity: '1',
                    minWidth: '350px',
                    padding: '20px',
                    background: '#111827'
                }
            });

            // Trigger Download
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `MindTotem_${new Date().getTime()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Restore transform
            element.style.transform = originalTransform;

        } catch (error: any) {
            console.error("Totem Capture Error:", error);
            alert(`토템 저장 중 오류가 발생했습니다: ${error.message || error}`);
        } finally {
            setIsCapturing(false);
        }
    };

    return (
        <button
            onClick={handleCapture}
            disabled={isCapturing}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-yellow-600/20 to-yellow-800/20 border border-yellow-600/50 hover:bg-yellow-600/30 transition-all group disabled:opacity-50 disabled:cursor-wait"
        >
            {isCapturing ? (
                <>
                    <Loader2 className="w-4 h-4 text-primary-gold animate-spin" />
                    <span className="text-sm font-medium text-primary-gold">토템 제작 중...</span>
                </>
            ) : (
                <>
                    <Sparkles className="w-4 h-4 text-purple-400 group-hover:scale-125 transition-transform" />
                    <span className="text-sm font-bold bg-gradient-to-r from-primary-gold to-yellow-300 bg-clip-text text-transparent">
                        {label}
                    </span>
                    <Download className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </>
            )}
        </button>
    );
}
