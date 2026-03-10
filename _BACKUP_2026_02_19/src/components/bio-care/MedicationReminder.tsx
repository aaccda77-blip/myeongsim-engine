/**
 * /components/bio-care/MedicationReminder.tsx
 * 복약 알림 시스템
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MedicationSchedule {
    id: string;
    medicationName: string;
    time: string;
    enabled: boolean;
    taken: boolean;
    lastTaken?: string;
}

export default function MedicationReminder() {
    const [schedules, setSchedules] = useState<MedicationSchedule[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newMedName, setNewMedName] = useState('');
    const [newMedTime, setNewMedTime] = useState('08:00');

    // 로컬 스토리지에서 스케줄 불러오기
    useEffect(() => {
        const saved = localStorage.getItem('medicationSchedules');
        if (saved) {
            setSchedules(JSON.parse(saved));
        }
    }, []);

    // 스케줄 저장
    const saveSchedules = (newSchedules: MedicationSchedule[]) => {
        setSchedules(newSchedules);
        localStorage.setItem('medicationSchedules', JSON.stringify(newSchedules));
    };

    // 알림 추가
    const handleAddSchedule = () => {
        if (!newMedName.trim()) {
            alert('약물 이름을 입력하세요.');
            return;
        }

        const newSchedule: MedicationSchedule = {
            id: Date.now().toString(),
            medicationName: newMedName,
            time: newMedTime,
            enabled: true,
            taken: false
        };

        saveSchedules([...schedules, newSchedule]);
        setNewMedName('');
        setNewMedTime('08:00');
        setShowAddModal(false);
    };

    // 복약 완료 체크
    const handleMarkTaken = (id: string) => {
        const updated = schedules.map(schedule =>
            schedule.id === id
                ? { ...schedule, taken: true, lastTaken: new Date().toISOString() }
                : schedule
        );
        saveSchedules(updated);
    };

    // 알림 토글
    const handleToggle = (id: string) => {
        const updated = schedules.map(schedule =>
            schedule.id === id
                ? { ...schedule, enabled: !schedule.enabled }
                : schedule
        );
        saveSchedules(updated);
    };

    // 삭제
    const handleDelete = (id: string) => {
        if (confirm('이 알림을 삭제하시겠습니까?')) {
            saveSchedules(schedules.filter(s => s.id !== id));
        }
    };

    // 오늘 복약 완료율
    const todayAdherence = schedules.length > 0
        ? Math.round((schedules.filter(s => s.taken).length / schedules.length) * 100)
        : 0;

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-white text-lg font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-400">alarm</span>
                        복약 알림
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                        규칙적인 복약으로 치료 효과 높이기
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="w-10 h-10 bg-[#658c42] hover:bg-[#7aa350] rounded-full flex items-center justify-center transition-colors"
                >
                    <span className="material-symbols-outlined text-white">add</span>
                </button>
            </div>

            {/* 오늘의 순응도 */}
            {schedules.length > 0 && (
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-300 text-sm font-bold">오늘의 복약 순응도</span>
                        <span className="text-white text-2xl font-bold">{todayAdherence}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${todayAdherence}%` }}
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        />
                    </div>
                </div>
            )}

            {/* 스케줄 목록 */}
            {schedules.length === 0 ? (
                <div className="text-center py-8">
                    <span className="material-symbols-outlined text-gray-600 text-5xl mb-3 block">
                        medication
                    </span>
                    <p className="text-gray-400 text-sm">
                        아직 등록된 알림이 없습니다.<br />
                        + 버튼을 눌러 추가해 보세요.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {schedules.map((schedule) => (
                        <div
                            key={schedule.id}
                            className={`p-4 rounded-xl border transition-all ${schedule.taken
                                    ? 'bg-green-500/10 border-green-500/30'
                                    : 'bg-white/5 border-white/10'
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-white font-bold">
                                            {schedule.medicationName}
                                        </h4>
                                        {schedule.taken && (
                                            <span className="text-green-400 text-xs bg-green-500/20 px-2 py-0.5 rounded-full">
                                                ✓ 복용 완료
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-400 text-sm flex items-center gap-1">
                                        <span className="material-symbols-outlined text-xs">schedule</span>
                                        {schedule.time}
                                        {schedule.lastTaken && (
                                            <span className="text-xs ml-2">
                                                (마지막: {new Date(schedule.lastTaken).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })})
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!schedule.taken && (
                                        <button
                                            onClick={() => handleMarkTaken(schedule.id)}
                                            className="px-3 py-1 bg-[#658c42] hover:bg-[#7aa350] text-white text-xs rounded-lg transition-colors"
                                        >
                                            복용 완료
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(schedule.id)}
                                        className="text-gray-500 hover:text-red-400 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 추가 모달 */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAddModal(false)}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-[#1f2937] rounded-2xl p-6 w-full max-w-sm border border-white/10"
                        >
                            <h3 className="text-white text-lg font-bold mb-4">
                                복약 알림 추가
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-gray-400 text-sm mb-2 block">
                                        약물 이름
                                    </label>
                                    <input
                                        type="text"
                                        value={newMedName}
                                        onChange={(e) => setNewMedName(e.target.value)}
                                        placeholder="예: 삭센다"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#658c42]"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-400 text-sm mb-2 block">
                                        복약 시간
                                    </label>
                                    <input
                                        type="time"
                                        value={newMedTime}
                                        onChange={(e) => setNewMedTime(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#658c42]"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 mt-6">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleAddSchedule}
                                    className="flex-1 py-3 bg-[#658c42] hover:bg-[#7aa350] text-white rounded-xl font-bold transition-colors"
                                >
                                    추가
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* 안내 */}
            <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <p className="text-yellow-200 text-xs leading-relaxed">
                    💡 <strong>복약 순응도 Tip</strong><br />
                    매일 같은 시간에 복용하면 약물 혈중 농도가 일정하게 유지되어 치료 효과가 높아집니다.
                </p>
            </div>
        </div>
    );
}
