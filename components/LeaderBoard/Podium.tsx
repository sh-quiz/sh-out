'use client';

import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';

const PodiumCard = ({ rank, user, delay }: { rank: number, user: any, delay: number }) => {
    const isFirst = rank === 1;
    const isSecond = rank === 2;
    const isThird = rank === 3;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`relative flex flex-col items-center ${isFirst ? '-mt-12 z-20' : 'z-10'}`}
        >
            {/* Crown for #1 */}
            {isFirst && (
                <motion.div
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="mb-4 relative"
                >
                    <Crown className="w-8 h-8 text-[#007AFF]" fill="#007AFF" />
                    <div className="absolute inset-0 bg-[#007AFF] blur-xl opacity-40" />
                </motion.div>
            )}

            {/* Avatar Circle */}
            <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: isFirst ? 0 : 1 }}
                className={`
                    relative rounded-full p-[2px] mb-4
                    ${isFirst ? 'w-[80px] h-[80px] bg-gradient-to-b from-[#007AFF] to-[#007AFF]/20' : ''}
                    ${isSecond || isThird ? 'w-[64px] h-[64px] bg-gradient-to-b from-[#FFB340] to-[#FFB340]/20' : ''}
                `}
            >
                <div className="w-full h-full rounded-full bg-[#0D1117] border border-black overflow-hidden relative">
                    {/* Placeholder Avatar */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white/20">
                        IMG
                    </div>
                </div>

                {/* Rank Badge with Stroke Animation */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 32 32">
                        <motion.circle
                            cx="16"
                            cy="16"
                            r="14"
                            fill={isFirst ? '#007AFF' : '#FFB340'}
                            stroke={isFirst ? '#34D399' : '#FFF'}
                            strokeWidth="2"
                            strokeDasharray="100"
                            strokeDashoffset="100"
                            initial={{ strokeDashoffset: 100 }}
                            animate={{ strokeDashoffset: 0 }}
                            transition={{ duration: 1.5, ease: "easeInOut", delay: delay + 0.5 }}
                        />
                    </svg>
                    <span className="relative z-10 text-[12px] font-bold text-black">
                        #{rank}
                    </span>
                </div>
            </motion.div>

            {/* User Info */}
            <div className="text-center">
                <h3 className="text-white font-medium text-sm mb-1">{user.name}</h3>
                <p className="text-[#878D96] text-xs mb-3">{user.school}</p>
                <span className={`
                    font-bold tracking-tight
                    ${isFirst ? 'text-3xl text-white' : 'text-xl text-white/90'}
                `}>
                    {user.score}
                </span>
            </div>

            {/* Glow Effect */}
            <div className={`
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full blur-[60px] -z-10 pointer-events-none
                ${isFirst ? 'bg-[#34D399]/10' : 'bg-[#FFB340]/5'}
            `} />
        </motion.div>
    );
};


    export default function Podium({ users }: { users: any[] }) {
    // Ensure we always have 3 spots, even if empty
    const podiumUsers = [
        users.find(u => u.rank === 2) || null,
        users.find(u => u.rank === 1) || null,
        users.find(u => u.rank === 3) || null,
    ];

    return (
        <div className="flex items-end justify-center gap-4 px-6 mb-12 min-h-[300px]">
            {podiumUsers[0] && <PodiumCard rank={2} user={{
                name: `${podiumUsers[0].user.firstName} ${podiumUsers[0].user.lastName.charAt(0)}.`,
                school: podiumUsers[0].user.school || 'Unknown School',
                score: podiumUsers[0].score.toLocaleString()
            }} delay={0.2} />}
            
            {podiumUsers[1] && <PodiumCard rank={1} user={{
                name: `${podiumUsers[1].user.firstName} ${podiumUsers[1].user.lastName.charAt(0)}.`,
                school: podiumUsers[1].user.school || 'Unknown School',
                score: podiumUsers[1].score.toLocaleString()
            }} delay={0} />}
            
            {podiumUsers[2] && <PodiumCard rank={3} user={{
                name: `${podiumUsers[2].user.firstName} ${podiumUsers[2].user.lastName.charAt(0)}.`,
                school: podiumUsers[2].user.school || 'Unknown School',
                score: podiumUsers[2].score.toLocaleString()
            }} delay={0.4} />}
        </div>
    );
}

