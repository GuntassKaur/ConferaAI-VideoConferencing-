"use client";

import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  PhoneOff,
  MessageSquare,
  FileText,
  Sparkles,
} from "lucide-react";

export default function RoomPage() {
  return (
    <div className="h-screen bg-[#0B1120] text-[#F9FAFB] flex flex-col font-sans">
      
      {/* Topbar */}
      <div className="h-14 border-b border-[#1F2937] px-6 flex items-center justify-between bg-[#0B1120]/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            C
          </div>
          <div>
            <h1 className="text-sm font-semibold text-[#F9FAFB]">
              Confera Strategic Sync
            </h1>
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-widest font-bold">
              Professional Team Collaboration
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider">
          <div className="px-3 py-1.5 rounded-lg bg-[#111827] border border-[#1F2937] text-[#9CA3AF] flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            2 Participants
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Recording
          </div>
        </div>
      </div>

      {/* Video Grid Area */}
      <div className="flex-1 p-6 flex items-center justify-center relative overflow-hidden">
        {/* Background Noise/Gradient */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        <div className="w-full max-w-6xl h-full grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh]">
          {/* Local Participant */}
          <div className="bg-[#111827] rounded-2xl border border-[#1F2937] relative overflow-hidden group shadow-2xl transition-all hover:border-indigo-500/30">
            <div className="absolute inset-0 flex items-center justify-center bg-[#0B1120]">
               <div className="w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl font-bold text-indigo-400">
                 GK
               </div>
            </div>
            <div className="absolute bottom-4 left-4 text-xs font-bold bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
              You
              <Mic size={12} className="text-emerald-400" />
            </div>
          </div>

          {/* Remote Participant */}
          <div className="bg-[#111827] rounded-2xl border border-[#1F2937] relative overflow-hidden group shadow-2xl transition-all hover:border-indigo-500/30">
            <div className="absolute inset-0 flex items-center justify-center bg-[#0B1120]">
               <div className="w-20 h-20 rounded-full bg-slate-800 border border-white/5 flex items-center justify-center text-2xl font-bold text-slate-500">
                 P1
               </div>
            </div>
            <div className="absolute bottom-4 left-4 text-xs font-bold bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
              Participant
              <MicOff size={12} className="text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="h-24 border-t border-[#1F2937] flex items-center justify-center gap-4 bg-[#0B1120]/80 backdrop-blur-md z-10">
        
        <div className="flex items-center gap-3">
          <button className="w-12 h-12 rounded-xl bg-[#111827] border border-[#1F2937] flex items-center justify-center text-[#F9FAFB] hover:bg-[#1F2937] hover:border-indigo-500/50 transition-all active:scale-95 group">
            <Mic size={20} className="group-hover:text-indigo-400 transition-colors" />
          </button>

          <button className="w-12 h-12 rounded-xl bg-[#111827] border border-[#1F2937] flex items-center justify-center text-[#F9FAFB] hover:bg-[#1F2937] hover:border-indigo-500/50 transition-all active:scale-95 group">
            <Video size={20} className="group-hover:text-indigo-400 transition-colors" />
          </button>
        </div>

        <div className="w-px h-8 bg-[#1F2937] mx-2" />

        <div className="flex items-center gap-3">
          <button className="w-12 h-12 rounded-xl bg-[#111827] border border-[#1F2937] flex items-center justify-center text-[#F9FAFB] hover:bg-[#1F2937] hover:border-indigo-500/50 transition-all active:scale-95 group" title="Share Screen">
            <MonitorUp size={20} className="group-hover:text-indigo-400 transition-colors" />
          </button>

          <button className="w-12 h-12 rounded-xl bg-[#111827] border border-[#1F2937] flex items-center justify-center text-[#F9FAFB] hover:bg-[#1F2937] hover:border-indigo-500/50 transition-all active:scale-95 group" title="Chat">
            <MessageSquare size={20} className="group-hover:text-indigo-400 transition-colors" />
          </button>

          <button className="w-12 h-12 rounded-xl bg-[#111827] border border-[#1F2937] flex items-center justify-center text-[#F9FAFB] hover:bg-[#1F2937] hover:border-indigo-500/50 transition-all active:scale-95 group" title="Notes">
            <FileText size={20} className="group-hover:text-indigo-400 transition-colors" />
          </button>

          <button className="px-5 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 hover:bg-indigo-500/20 transition-all active:scale-95 gap-2 font-bold text-[10px] uppercase tracking-widest">
            <Sparkles size={16} />
            AI Recap
          </button>
        </div>

        <div className="w-px h-8 bg-[#1F2937] mx-2" />

        <button className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center hover:bg-red-500 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-red-600/20" title="End Session">
          <PhoneOff size={22} />
        </button>
      </div>
    </div>
  );
}
