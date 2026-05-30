'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Clock, BookHeart, UserCircle2, Lightbulb } from 'lucide-react';
import { useAuthUser } from '@/hooks/useAuthUser';

interface CommentType {
  id: string;
  user_id: string;
  date: string;
  content: string;
  created_at: string;
}

export default function DailyMatrixComments() {
  const user = useAuthUser();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // KST Date string for today
  const getTodayKST = () => {
    const now = new Date();
    const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    return kstDate.toISOString().split('T')[0];
  };

  const today = getTodayKST();

  useEffect(() => {
    if (user && user.id !== 'anonymous') {
      fetchComments();
    } else if (user && user.id === 'anonymous') {
      setIsFetching(false);
    }
  }, [user]);

  const fetchComments = async () => {
    setIsFetching(true);
    try {
      const res = await fetch(`/api/os/daily-matrix/comments?userId=${user.id}&date=${today}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setComments(data.data);
        }
      }
    } catch (e) {
      console.error('Failed to fetch comments', e);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user || user.id === 'anonymous') return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/os/daily-matrix/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          date: today,
          content: newComment
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          // 최신 글이 맨 위로 오도록
          setComments([data.data, ...comments]);
          setNewComment('');
        }
      }
    } catch (e) {
      console.error('Failed to post comment', e);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${ampm} ${hours}:${minutesStr}`;
  };

  if (!user || user.id === 'anonymous') {
    return (
      <div className="w-full bg-slate-900/40 rounded-3xl border border-slate-700/50 p-6 md:p-8 flex flex-col items-center justify-center min-h-[200px] backdrop-blur-md">
        <BookHeart className="w-8 h-8 text-slate-500 mb-3" />
        <p className="text-sm text-slate-400 font-medium">로그인하시면 사색 기록장을 이용하실 수 있습니다.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900/40 rounded-3xl border border-slate-700/50 overflow-hidden relative backdrop-blur-md">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800/20 to-transparent pointer-events-none" />
      
      <div className="p-6 md:p-8 relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
            <BookHeart className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-200">나만의 사색 일기장</h3>
            <p className="text-xs text-slate-400">오늘의 내면 소스코드를 마주한 느낌을 자유롭게 기록하세요.</p>
          </div>
        </div>

        {/* 작성 가이드 (초보자용) */}
        <div className="mb-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 md:p-5">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-1.5 text-sm text-slate-300">
              <p className="font-medium tracking-tight text-indigo-200">어떻게 적어야 할지 막막하신가요?</p>
              <ul className="list-disc list-outside ml-4 space-y-2 text-xs md:text-sm text-slate-400 leading-relaxed">
                <li><strong className="text-slate-300">[관찰 및 수용 - 마음챙김]</strong> "오늘 직장에서 화가 나는 일이 있었고 불안함이 밀려왔다. 도망치지 않고 그 느낌이 가슴 어디에 머무는지 판단 없이 가만히 관찰했다."</li>
                <li><strong className="text-slate-300">[네트워크 연결 - 보편적 인간 경험]</strong> "사람들과 부대끼다 보면 누구나 이렇게 감정이 투사되고 힘든 순간을 겪는다. 이건 나만의 결함이 아니라 누구나 겪을 수 있는 자연스러운 일이다."</li>
                <li><strong className="text-slate-300">[안전 모드 - 자기 친절]</strong> "(가슴에 손을 얹으며) 이 불편한 감정을 외면하지 않고 견뎌내느라 정말 애썼어. 오늘은 나를 위해 충분한 휴식과 따뜻한 차 한 잔을 줘야겠다."</li>
              </ul>
              <p className="text-xs text-slate-500 pt-1">
                ※ 이 공간은 누구에게도 공개되지 않는 프라이빗한 공간입니다. 솔직하게 적어 내려가세요.
              </p>
            </div>
          </div>
        </div>

        {/* 입력창 */}
        <form onSubmit={handleSubmit} className="mb-8 relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="지금 이 순간, 어떤 감정이 밀려오나요? 무엇을 알아차리셨나요?"
            className="w-full h-32 bg-slate-950/50 border border-slate-700/50 rounded-2xl p-4 text-slate-300 text-sm placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 resize-none transition-all duration-300 scrollbar-hide"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!newComment.trim() || isLoading}
            className={`absolute bottom-3 right-3 p-2.5 rounded-xl flex items-center justify-center transition-all duration-300
              ${newComment.trim() && !isLoading
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }
            `}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>

        {/* 타임라인 목록 */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
          {isFetching ? (
            <div className="flex justify-center py-8">
              <div className="w-5 h-5 border-2 border-slate-700 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-10">
              <div className="inline-flex w-12 h-12 rounded-full bg-slate-800/50 items-center justify-center mb-3 border border-slate-700/50">
                <UserCircle2 className="w-5 h-5 text-slate-500" />
              </div>
              <p className="text-sm text-slate-400">아직 오늘의 기록이 없습니다.</p>
              <p className="text-xs text-slate-500 mt-1">당신의 진솔한 마음을 가장 먼저 남겨보세요.</p>
            </div>
          ) : (
            <AnimatePresence>
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800/30 rounded-2xl p-5 border border-slate-700/30 hover:border-slate-600/50 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-300">
                        나
                      </div>
                      <span className="text-xs font-medium text-slate-400">
                        기록자
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span className="text-[10px] uppercase tracking-wider">
                        {formatTime(comment.created_at)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
