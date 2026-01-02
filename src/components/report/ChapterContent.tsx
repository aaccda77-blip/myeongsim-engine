'use client';

import { motion } from 'framer-motion';

// Simple text content renderer that reveals paragraph by paragraph
export default function ChapterContent({ text }: { text: string }) {
    // Split by newlines, filter empty
    const paragraphs = text.split('\n').filter(p => p.trim().length > 0);

    return (
        <div className="space-y-6">
            {paragraphs.map((para, idx) => (
                <motion.p
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-gray-300 leading-relaxed font-sans font-light"
                >
                    {/* Basic highlighting logic - wrap bold text or quotes if needed */}
                    {para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .split(/(<strong>.*?<\/strong>)/g).map((part, i) =>
                            part.startsWith('<strong>') ? (
                                <span key={i} className="text-white font-bold decoration-primary-olive/30 decoration-2 underline-offset-4">
                                    {part.replace(/<\/?strong>/g, '')}
                                </span>
                            ) : part
                        )
                    }
                </motion.p>
            ))}
        </div>
    );
}
