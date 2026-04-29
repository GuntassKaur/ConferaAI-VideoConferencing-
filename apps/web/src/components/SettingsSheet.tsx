"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Video, Mic, ShieldAlert, Monitor, Volume2, Key, Sliders, VolumeX, EyeOff, Bot } from 'lucide-react';

interface SettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsSheet({ isOpen, onClose }: SettingsSheetProps) {
  const [activeTab, setActiveTab] = useState<'ai' | 'av'>('ai');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center font-sans">
          
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Sheet/Modal Container */}
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full max-w-4xl bg-[#0a0a1a] border border-white/10 rounded-t-[32px] sm:rounded-[32px] shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Sliders className="w-6 h-6 mr-3 text-indigo-400" />
                Preferences
              </h2>
              <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              
              {/* Sidebar Tabs */}
              <div className="w-64 border-r border-white/5 bg-black/20 p-4 space-y-2">
                <button 
                  onClick={() => setActiveTab('ai')}
                  className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors font-medium text-sm ${activeTab === 'ai' ? 'bg-indigo-500/20 text-indigo-300' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                >
                  <Sparkles className="w-4 h-4 mr-3" /> AI & Copilot
                </button>
                <button 
                  onClick={() => setActiveTab('av')}
                  className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors font-medium text-sm ${activeTab === 'av' ? 'bg-indigo-500/20 text-indigo-300' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                >
                  <Video className="w-4 h-4 mr-3" /> Audio & Video
                </button>
              </div>

              {/* Settings Content Area */}
              <div className="flex-1 p-8 overflow-y-auto space-y-8 scrollbar-hide">
                
                {activeTab === 'ai' && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                    
                    {/* Persona */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider">AI Persona</h3>
                      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-white">Assistant Name</p>
                          <p className="text-sm text-white/50">What should we call your AI?</p>
                        </div>
                        <input type="text" defaultValue="Confera" className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" />
                      </div>
                    </div>

                    {/* Behavior */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider">Behavior & Output</h3>
                      
                      <div className="grid gap-4">
                        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-white">Recap Depth</p>
                            <p className="text-sm text-white/50">Detail level of automated summaries</p>
                          </div>
                          <select className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white outline-none w-48">
                            <option>Quick (3 bullets)</option>
                            <option>Standard</option>
                            <option>Deep Dive</option>
                          </select>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-white">Co-pilot Mode</p>
                            <p className="text-sm text-white/50">How active should the AI be?</p>
                          </div>
                          <select className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white outline-none w-48">
                            <option>Proactive (Suggests)</option>
                            <option>On-demand (Ask only)</option>
                            <option>Off</option>
                          </select>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-white">Default Language</p>
                            <p className="text-sm text-white/50">For transcripts and recaps</p>
                          </div>
                          <select className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white outline-none w-48">
                            <option>Auto-detect</option>
                            <option>English</option>
                            <option>Spanish</option>
                            <option>French</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Custom Vocabulary */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider">Custom Vocabulary</h3>
                      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                        <p className="text-sm text-white/50 mb-3">Add company-specific terms, acronyms, or names for better transcription accuracy.</p>
                        <textarea 
                          placeholder="e.g. ConferaAI, Supabase, Tailwind..." 
                          className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-indigo-500 resize-none h-24"
                        />
                      </div>
                    </div>

                    {/* Privacy */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-red-400/80 uppercase tracking-wider flex items-center"><ShieldAlert className="w-4 h-4 mr-2"/> Privacy Options</h3>
                      <div className="bg-red-500/5 border border-red-500/10 p-5 rounded-2xl flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-white flex items-center"><EyeOff className="w-4 h-4 mr-2 text-red-400"/> Don&apos;t Transcribe Meetings</p>
                          <p className="text-sm text-white/50">Pause all AI processing and transcription locally.</p>
                        </div>
                        <div className="w-12 h-6 bg-white/10 rounded-full flex items-center p-1 cursor-pointer">
                          <div className="w-4 h-4 bg-white/40 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'av' && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                    
                    {/* Audio */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider">Audio Settings</h3>
                      <div className="grid gap-4">
                        
                        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center">
                            <Mic className="w-5 h-5 mr-4 text-white/60" />
                            <div>
                              <p className="font-semibold text-white">Microphone</p>
                              <div className="flex items-center mt-2 space-x-1">
                                {[...Array(8)].map((_, i) => (
                                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < 3 ? 'bg-emerald-400' : 'bg-white/10'}`} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <select className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white outline-none w-48">
                            <option>Default - MacBook Pro Mic</option>
                            <option>External USB Mic</option>
                          </select>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center">
                            <Volume2 className="w-5 h-5 mr-4 text-white/60" />
                            <div>
                              <p className="font-semibold text-white">Speaker</p>
                              <button className="text-xs text-indigo-400 font-medium mt-1 hover:underline">Test Tone</button>
                            </div>
                          </div>
                          <select className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white outline-none w-48">
                            <option>Default - MacBook Pro Speakers</option>
                            <option>Headphones</option>
                          </select>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center">
                            <VolumeX className="w-5 h-5 mr-4 text-white/60" />
                            <div>
                              <p className="font-semibold text-white">AI Noise Cancellation</p>
                              <p className="text-sm text-white/50">Removes background chatter</p>
                            </div>
                          </div>
                          <select className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white outline-none w-48">
                            <option>Off</option>
                            <option>Light</option>
                            <option>Strong</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Video */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider">Video Settings</h3>
                      <div className="grid gap-4">
                        
                        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Video className="w-5 h-5 mr-4 text-white/60" />
                              <p className="font-semibold text-white">Camera</p>
                            </div>
                            <select className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white outline-none w-48">
                              <option>FaceTime HD Camera</option>
                            </select>
                          </div>
                          <div className="w-full h-48 bg-black rounded-xl overflow-hidden relative border border-white/5 flex items-center justify-center">
                            {/* Live Preview Mock */}
                            <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">LIVE</div>
                          </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-white">Virtual Background</p>
                          </div>
                          <select className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white outline-none w-48">
                            <option>None</option>
                            <option>Blur (Standard)</option>
                            <option>Blur (Heavy)</option>
                            <option>Custom Image...</option>
                          </select>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-white">Max Resolution</p>
                          </div>
                          <select className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white outline-none w-48">
                            <option>Auto (Optimized)</option>
                            <option>720p HD</option>
                            <option>1080p FHD</option>
                          </select>
                        </div>

                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
