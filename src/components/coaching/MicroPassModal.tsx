// src/components/coaching/MicroPassModal.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, CheckCircle2, Building2 } from 'lucide-react';

interface MicroPassModalProps {
    isOpen: boolean;
    onClose: () => void;
    userSajuData?: any;
    onUpgradeToFullPass?: () => void;
}

export const MicroPassModal: React.FC<MicroPassModalProps> = () => {
    // 🌟 [오픈기념 전면 무료 개방] 결제 모달을 일절 띄우지 않습니다.
    return null;
};

export default MicroPassModal;
