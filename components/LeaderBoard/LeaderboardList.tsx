'use client';

import { motion } from 'framer-motion';

const LeaderboardRow = ({ rank, user, index }: { rank: number, user: any, index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + (index * 0.05), duration: 0.5 }}
            className="flex items-center h-[80px] px-6 border-b border-white/5 hover:bg-white/[0.02] transition-colors"
        >
            {/* Rank */}
            <span className={`w-8 text-sm font-medium ${rank <= 10 ? 'text-white' : 'text-[#878D96]'}`}>
                {rank}
            </span>

            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-[#161B22] mx-4 flex-shrink-0" />

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h4 className="text-white text-sm font-medium truncate">{user.name}</h4>
                <p className="text-[#878D96] text-xs truncate">{user.school}</p>
            </div>

            {/* Score */}
            <span className="text-white font-bold text-sm tracking-wide">
                {user.score}
            </span>
        </motion.div>
    );
};

export default function LeaderboardList() {
    // Generate dummy data for rows 4-50
    const rows = Array.from({ length: 47 }, (_, i) => ({
        rank: i + 4,
        name: `User ${i + 4}`,
        school: 'University',
        score: (2700 - i * 50).toLocaleString(),
    }));

    return (
        <div className="pb-24">
            {rows.map((user, i) => (
                <LeaderboardRow key={i} rank={user.rank} user={user} index={i} />
            ))}
        </div>
    );
}
