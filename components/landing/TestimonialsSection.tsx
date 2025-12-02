"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
    {
        name: "David K.",
        role: "Quiz Enthusiast",
        content: "The Sharks is hands down the best quiz app I've ever used. The competitive aspect makes it so addictive!",
        avatar: "👨‍💻",
    },
    {
        name: "Sarah M.",
        role: "Trivia Master",
        content: "I love the daily tournaments. It's challenging but fair, and the community is amazing.",
        avatar: "👩‍🔬",
    },
    {
        name: "James L.",
        role: "Student",
        content: "Learned more here in a week than in a month of classes. The gamification really works.",
        avatar: "🎓",
    },
];

export default function TestimonialsSection() {
    return (
        <section className="py-24 bg-sharks-navy relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute -right-20 top-20 w-96 h-96 bg-sharks-blue/5 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-bold text-sharks-white mb-4"
                    >
                        What Players Say
                    </motion.h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-sharks-white/5 p-8 rounded-3xl border border-sharks-white/5 relative"
                        >
                            <div className="absolute -top-4 left-8 bg-sharks-blue text-white p-2 rounded-xl shadow-lg">
                                <Star className="w-5 h-5 fill-current" />
                            </div>

                            <p className="text-sharks-rose/80 mb-6 italic">
                                "{testimonial.content}"
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-sharks-white/10 rounded-full flex items-center justify-center text-2xl">
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sharks-white">{testimonial.name}</h4>
                                    <p className="text-sm text-sharks-rose/50">{testimonial.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
