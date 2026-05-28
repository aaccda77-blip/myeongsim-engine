'use client';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Fingerprint, Activity, Sparkles, X, HeartPulse, CigaretteOff, Orbit } from 'lucide-react';
import DeSyncEgo from './DeSyncEgo';
import SystemDebugging from './SystemDebugging';
import PotentialDrive from './PotentialDrive';
import OSUpgradeLog from './OSUpgradeLog';
import DietProtocol from './DietProtocol';
import AddictionProtocol from './AddictionProtocol';
import SajuProtocol from './SajuProtocol';

type TabType = 'desync' | 'debug' | 'potential' | 'log' | 'diet' | 'addiction' | 'saju';

interface Props {
  onClose?: () => void;
  isModal?: boolean;
}

export default function MyeongsimOSDashboard({ onClose, isModal = false }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('desync');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case 'desync': return <DeSyncEgo />;
      case 'debug': return <SystemDebugging />;
      case 'potential': return <PotentialDrive />;
      case 'log': return <OSUpgradeLog />;
      case 'diet': return <DietProtocol />;
      case 'addiction': return <AddictionProtocol />;
      case 'saju': return <SajuProtocol />;
      default: return <DeSyncEgo />;
    }
  };

  const tabs = [
    { id: 'desync', label: '에고 동기화 해제', icon: <Fingerprint className="w-4 h-4" /> },
    { id: 'debug', label: '시스템 디버깅', icon: <Activity className="w-4 h-4" /> },
    { id: 'potential', label: '포텐셜 드라이브', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'log', label: '업그레이드 로그', icon: <Cpu className="w-4 h-4" /> },
    { id: 'diet', label: '바디 디버깅', icon: <HeartPulse className="w-4 h-4" /> },
    { id: 'addiction', label: '금연·금주', icon: <CigaretteOff className="w-4 h-4" /> },
    { id: 'saju', label: '운명 포맷', icon: <Orbit className="w-4 h-4" /> },
  ];

  const content = (
    <div className={`w-full h-dvh bg-slate-950 flex flex-col relative overflow-hidden ${isModal ? 'fixed inset-0 z-[9999]' : ''}`}>
      {isModal && onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 bg-slate-900/50 border border-slate-700 rounded-full flex items-center justify-center text-slate-300 hover:bg-slate-800 transition-colors backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-y-auto">
        <div className="absolute inset-0">
          {renderTab()}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="h-20 bg-slate-950/80 backdrop-blur-xl border-t border-slate-800 flex items-center px-2 z-40 relative pb-safe overflow-x-auto whitespace-nowrap scrollbar-hide">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className="flex flex-col items-center justify-center gap-1 min-w-[72px] flex-1 h-full relative flex-shrink-0"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' 
                  : 'bg-slate-900/50 text-slate-500'
              }`}>
                {tab.icon}
              </div>
              <span className={`text-[9px] font-bold transition-colors ${
                isActive ? 'text-indigo-200' : 'text-slate-600'
              }`}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="activeTabIndicator" 
                  className="absolute bottom-0 w-8 h-1 bg-indigo-500 rounded-t-full shadow-[0_0_10px_#6366f1]" 
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );

  if (isModal) {
    if (!mounted) return null;
    return createPortal(content, document.body);
  }

  return content;
}
