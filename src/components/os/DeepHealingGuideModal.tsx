'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Heart, Compass, Shield, Wind, CheckCircle2, MessageCircle, Send } from 'lucide-react';

interface HealingModuleData {
  theme: string;
  module1: { title: string; description: string; };
  module2: { title: string; allowing: string; embracing: string; accepting: string; };
  module3: { title: string; msc: string; act: string; };
  module4: { title: string; affirmations: string[]; };
}

interface HealingPost {
  id: string;
  date_string: string;
  theme: string;
  content: HealingModuleData;
}

interface Comment {
  id: string;
  guest_name: string;
  content: string;
  created_at: string;
}

interface Props {
  onClose: () => void;
  dateString?: string;
  userId?: string;
  dayMaster?: string;
}

export default function DeepHealingGuideModal({ onClose, dateString, userId, dayMaster }: Props) {
  const [post, setPost] = useState<HealingPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState<boolean[]>([false, false, false]);
  
  // Comment Form States
  const [newGuestName, setNewGuestName] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Use the personalized API if we have user info
        if (userId && dayMaster) {
          const res = await fetch('/api/os/my-daily-healing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, dayMaster })
          });
          if (res.ok) {
            const json = await res.json();
            if (json.success) {
              setPost(json.data);
              if (json.data.id) {
                fetchComments(json.data.id);
              }
            }
          }
        } else {
          // Fallback to global if not logged in
          const url = dateString ? `/api/os/daily-healing?date=${dateString}` : '/api/os/daily-healing';
          const res = await fetch(url);
          if (res.ok) {
            const json = await res.json();
            setPost(json);
            if (json.id) {
              fetchComments(json.id);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load healing guide", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dateString]);

  const fetchComments = async (postId: string) => {
    try {
      const endpoint = (userId && dayMaster) ? '/api/os/my-daily-healing/comments' : '/api/os/daily-healing/comments';
      const res = await fetch(`${endpoint}?postId=${postId}`);
      if (res.ok) {
        setComments(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post?.id || !newGuestName.trim() || !newComment.trim()) return;

    try {
      setIsSubmitting(true);
      const endpoint = (userId && dayMaster) ? '/api/os/my-daily-healing/comments' : '/api/os/daily-healing/comments';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: post.id,
          guest_name: newGuestName.trim(),
          content: newComment.trim()
        })
      });

      if (res.ok) {
        setNewComment('');
        // Refresh comments
        fetchComments(post.id);
      }
    } catch (err) {
      console.error("Failed to post comment", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCheck = (index: number) => {
    const newChecked = [...checkedItems];
    newChecked[index] = !newChecked[index];
    setCheckedItems(newChecked);
  };

  const data = post?.content;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl overflow-y-auto"
      >
        <div className="absolute inset-0 pointer-events-none" onClick={onClose} />
        
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-3xl bg-slate-900/80 border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
        >
          {/* Background effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

          {/* Header */}
          <div className="relative border-b border-slate-800 p-6 flex justify-between items-center bg-slate-900/60 backdrop-blur-md shrink-0">
            <div>
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-purple-300 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                상처가 별이 되는 시간
              </h2>
              {post && (
                <p className="text-sm text-slate-400 mt-1">
                  [{post.date_string}] 오늘의 테마: {post.theme}
                </p>
              )}
            </div>
            <button onClick={onClose} className="p-2 bg-slate-800/50 hover:bg-slate-700 rounded-full text-slate-400 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="relative p-6 overflow-y-auto scrollbar-hide space-y-8 flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                <p className="text-slate-400 text-sm animate-pulse">우주와 당신의 내면을 연결하는 중...</p>
              </div>
            ) : data ? (
              <>
                {/* Module 1: 마주함 */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-2xl border border-slate-700/50">
                  <h3 className="text-sm font-mono text-emerald-400 mb-3 flex items-center gap-2">
                    <span className="text-lg">🌪️</span> {data.module1.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed text-[15px] break-keep">{data.module1.description}</p>
                </motion.div>

                {/* Module 2: 치유의 3박자 */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
                  <h3 className="text-sm font-mono text-purple-400 mb-3 flex items-center gap-2 pl-2">
                    <span className="text-lg">🌿</span> {data.module2.title}
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-700/30 flex gap-4">
                      <div className="bg-slate-900/80 p-2 rounded-lg h-fit"><Wind className="w-5 h-5 text-sky-400" /></div>
                      <div>
                        <h4 className="text-sm font-bold text-sky-300 mb-2">허용 (Allowing)</h4>
                        <p className="text-[15px] text-slate-300 break-keep leading-relaxed">{data.module2.allowing}</p>
                      </div>
                    </div>
                    <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-700/30 flex gap-4">
                      <div className="bg-slate-900/80 p-2 rounded-lg h-fit"><Heart className="w-5 h-5 text-rose-400" /></div>
                      <div>
                        <h4 className="text-sm font-bold text-rose-300 mb-2">포용 (Embracing)</h4>
                        <p className="text-[15px] text-slate-300 break-keep leading-relaxed">{data.module2.embracing}</p>
                      </div>
                    </div>
                    <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-700/30 flex gap-4">
                      <div className="bg-slate-900/80 p-2 rounded-lg h-fit"><Shield className="w-5 h-5 text-emerald-400" /></div>
                      <div>
                        <h4 className="text-sm font-bold text-emerald-300 mb-2">수용 (Acceptance)</h4>
                        <p className="text-[15px] text-slate-300 break-keep leading-relaxed">{data.module2.accepting}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Module 3: 두 날개 */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-to-r from-indigo-950/40 to-purple-950/40 p-6 rounded-2xl border border-indigo-500/20">
                  <h3 className="text-sm font-mono text-indigo-300 mb-5 flex items-center gap-2">
                    <span className="text-lg">🕊️</span> {data.module3.title}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-900/60 p-5 rounded-xl">
                      <h4 className="text-sm font-bold text-rose-300 mb-3 flex items-center gap-2"><Heart className="w-4 h-4" /> 치유의 손길 (MSC)</h4>
                      <p className="text-[15px] text-slate-300 break-keep leading-relaxed">"{data.module3.msc}"</p>
                    </div>
                    <div className="bg-slate-900/60 p-5 rounded-xl">
                      <h4 className="text-sm font-bold text-sky-300 mb-3 flex items-center gap-2"><Compass className="w-4 h-4" /> 행동의 나침반 (ACT)</h4>
                      <p className="text-[15px] text-slate-300 break-keep leading-relaxed">"{data.module3.act}"</p>
                    </div>
                  </div>
                </motion.div>

                {/* Module 4: 처방전 */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50">
                  <h3 className="text-sm font-mono text-amber-400 mb-5 flex items-center gap-2">
                    <span className="text-lg">📝</span> {data.module4.title}
                  </h3>
                  <div className="space-y-3">
                    {data.module4.affirmations.map((affirmation, index) => (
                      <button key={index} onClick={() => toggleCheck(index)} className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${checkedItems[index] ? 'bg-emerald-950/30 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'}`}>
                        <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 transition-colors ${checkedItems[index] ? 'text-emerald-400' : 'text-slate-600'}`} />
                        <span className={`text-[15px] leading-relaxed ${checkedItems[index] ? 'text-emerald-200' : 'text-slate-300'}`}>{affirmation}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Module 5: 내면의 메아리 (Comments) */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-8 pt-8 border-t border-slate-800">
                  <h3 className="text-sm font-mono text-slate-300 mb-6 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-cyan-400" /> 내면의 메아리
                    <span className="text-xs text-slate-500 font-sans font-normal ml-2">당신의 다짐이나 감상을 남겨보세요</span>
                  </h3>
                  
                  {/* Comments List */}
                  <div className="space-y-4 mb-6">
                    {comments.map((comment) => (
                      <div key={comment.id} className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-sm text-cyan-300">{comment.guest_name}</span>
                          <span className="text-xs text-slate-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
                      </div>
                    ))}
                    {comments.length === 0 && (
                      <div className="text-center py-6 text-slate-500 text-sm">
                        아직 남겨진 메아리가 없습니다. 첫 번째 다짐을 남겨보세요.
                      </div>
                    )}
                  </div>

                  {/* Comment Form */}
                  <form onSubmit={handlePostComment} className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 space-y-3">
                    <input 
                      type="text" 
                      placeholder="닉네임 (예: 별빛)" 
                      value={newGuestName}
                      onChange={(e) => setNewGuestName(e.target.value)}
                      required
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                    />
                    <textarea 
                      placeholder="오늘 읽은 내용에 대한 감상이나 다짐을 남겨주세요." 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                      rows={3}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 resize-none"
                    />
                    <div className="flex justify-end">
                      <button 
                        type="submit" 
                        disabled={isSubmitting || !newGuestName.trim() || !newComment.trim()}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/30 transition-colors disabled:opacity-50 text-sm font-medium"
                      >
                        <Send className="w-4 h-4" /> 남기기
                      </button>
                    </div>
                  </form>
                </motion.div>
              </>
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
