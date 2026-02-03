"use client";

import { m as motion } from "framer-motion";

const UPDATES = [
  {
    date: "2026.01.27",
    content: "SNS 공유 미리보기 추가: 로스터를 공유하면 카카오톡, 트위터, 페이스북에서 선수 카드 미리보기 가능! 친구들에게 나만의 전설적인 로스터를 자랑하세요 (SNS Share Preview: Share your legendary roster with stunning player card previews on KakaoTalk, Twitter, Facebook!)",
    type: "Feature"
  },
  {
    date: "2026.01.27",
    content: "카드 UI 업데이트: 모던 헥스텍 디자인 및 월즈 우승자 특수 효과 추가 (Card UI Overhaul: Modern Hextech Design & Worlds Winner Effects)",
    type: "UI/UX"
  },
  {
    date: "2026.01.23",
    content: "페이커 모드 & 배경음악 업데이트: 전설의 시작, 페이커 특별 연출 및 사운드 추가 (Faker Mode & BGM Update: Legend's Beginning Special reveal & Audio)",
    type: "Feature"
  }
];

export default function UpdateHistory() {
  return (
    <section className="mt-20 py-12 border-t border-lol-gold/20">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-lol-gold/30" />
        <h2 className="text-2xl font-black text-lol-gold tracking-widest uppercase italic">
          Update History
        </h2>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-lol-gold/30" />
      </div>

      <div className="space-y-4 max-w-4xl mx-auto">
        {UPDATES.map((update, index) => (
          <motion.div
            key={`${update.date}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group flex gap-6 items-start p-4 rounded-lg bg-lol-dark-lighter/30 border border-white/5 hover:border-lol-gold/30 hover:bg-lol-dark-lighter/50 transition-all"
          >
            <div className="flex flex-col items-center">
              <span className="text-lol-gold font-bold tabular-nums text-sm">
                {update.date}
              </span>
              <div className="w-px h-full bg-lol-gold/20 group-hover:bg-lol-gold/50 transition-colors mt-2" />
            </div>
            
            <div className="flex-1">
              <span className="inline-block px-2 py-0.5 rounded bg-lol-gold/10 text-lol-gold text-[10px] font-bold uppercase mb-2 border border-lol-gold/20">
                {update.type}
              </span>
              <p className="text-lol-light group-hover:text-white transition-colors text-sm sm:text-base leading-relaxed">
                {update.content}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
