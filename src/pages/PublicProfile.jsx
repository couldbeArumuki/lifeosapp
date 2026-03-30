import { useState, useEffect } from 'react';
import { getData } from '../utils/localStorage';
import { Globe, BookOpen, Target, Trophy, Music2, Droplets, Dumbbell, Heart, Code2, User } from 'lucide-react';

const MJ_ALBUM_ID = '3OBhnTLrvkoEEETjFA3Qfk';

const moodEmoji = { happy: '😊', focused: '🎯', motivated: '🚀', calm: '🌿', tired: '😴', anxious: '😰' };

const statusIcon = { completed: '✅', 'in-progress': '⏳', 'not-started': '⭕' };
const statusLabel = { completed: 'Completed', 'in-progress': 'In Progress', 'not-started': 'Not Started' };
const priorityEmoji = { high: '🔥', medium: '⭐', low: '🌸' };

/* ─── Mock data for User Profile ─── */
const MOCK_GOALS = [
  { id: 1, title: 'Pass JLPT N3', progress: 65, target: 100 },
  { id: 2, title: 'Read 24 books this year', progress: 5, target: 24 },
  { id: 3, title: 'Build 3 portfolio projects', progress: 1, target: 3 },
  { id: 4, title: 'Exercise 5× per week', progress: 80, target: 100 },
];
const MOCK_HABITS = [
  { id: 1, name: 'Morning Meditation', streak: 7 },
  { id: 2, name: 'Japanese Study', streak: 14 },
  { id: 3, name: 'Exercise', streak: 5 },
  { id: 4, name: 'Read Books', streak: 3 },
  { id: 5, name: 'Drink 2L Water', streak: 10 },
];
const MOCK_MOODS = [
  { id: 1, mood: 'happy', intensity: 4, date: '2026-03-25', emoji: '😊' },
  { id: 2, mood: 'focused', intensity: 5, date: '2026-03-24', emoji: '🎯' },
  { id: 3, mood: 'tired', intensity: 2, date: '2026-03-23', emoji: '😴' },
  { id: 4, mood: 'motivated', intensity: 5, date: '2026-03-22', emoji: '🚀' },
  { id: 5, mood: 'calm', intensity: 3, date: '2026-03-21', emoji: '🌿' },
  { id: 6, mood: 'happy', intensity: 4, date: '2026-03-20', emoji: '😊' },
  { id: 7, mood: 'anxious', intensity: 2, date: '2026-03-19', emoji: '😰' },
];
const MOCK_JAPAN_PLANS = [
  { id: 1, title: 'Visit Tokyo Tower', category: 'Travel', status: 'not-started', priority: 'high', subcategory: 'Sightseeing' },
  { id: 2, title: 'Master Hiragana', category: 'Language', status: 'completed', priority: 'high', subcategory: 'Writing System' },
  { id: 3, title: 'Pass JLPT N5', category: 'Language', status: 'in-progress', priority: 'high', subcategory: 'Certification' },
  { id: 4, title: 'Try Authentic Ramen', category: 'Food', status: 'not-started', priority: 'medium', subcategory: 'Local Cuisine' },
  { id: 5, title: 'Book JR Pass', category: 'Travel', status: 'in-progress', priority: 'medium', subcategory: 'Transportation' },
  { id: 6, title: 'Master Katakana', category: 'Language', status: 'completed', priority: 'high', subcategory: 'Writing System' },
  { id: 7, title: 'Visit Akihabara', category: 'Travel', status: 'not-started', priority: 'medium', subcategory: 'Culture' },
  { id: 8, title: 'Learn Basic Phrases', category: 'Language', status: 'completed', priority: 'high', subcategory: 'Conversation' },
];

/* ─── Shared keyframes & tab bar ─── */
const SHARED_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Nunito:wght@400;700;900&family=Orbitron:wght@400;700;900&family=Bebas+Neue&display=swap');

  @keyframes gradientShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes shimmer {
    0%   { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }
  @keyframes floatSpark {
    0%,100% { transform: translateY(0)    rotate(0deg);   opacity:0.5; }
    33%     { transform: translateY(-15px) rotate(120deg); opacity:0.8; }
    66%     { transform: translateY(-8px)  rotate(240deg); opacity:0.6; }
  }
  @keyframes bounce-gentle {
    0%,100% { transform: translateY(0); }
    50%     { transform: translateY(-6px); }
  }
  @keyframes glowPulse {
    0%,100% { box-shadow: 0 0 10px rgba(0,212,255,0.4); }
    50%     { box-shadow: 0 0 25px rgba(0,212,255,0.8); }
  }
  @keyframes firePulse {
    0%,100% { box-shadow: 0 0 10px rgba(255,69,0,0.4); }
    50%     { box-shadow: 0 0 25px rgba(255,69,0,0.8); }
  }
  @keyframes scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  .bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
  .sparkle {
    position: fixed;
    pointer-events: none;
    z-index: 0;
    font-size: 20px;
    animation: floatSpark 6s ease-in-out infinite;
    opacity: 0.6;
  }

  /* ── Profile tab bar ── */
  .profile-tab-bar {
    display: flex;
    gap: 8px;
    padding: 12px 16px;
    position: sticky;
    top: 0;
    z-index: 30;
  }
  .profile-tab {
    flex: 1;
    padding: 10px 16px;
    border-radius: 12px;
    border: 2px solid transparent;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
`;

/* ─── Gyaru style (User Profile default) ─── */
const GYARU_STYLES = `
  .gyaru-page {
    background: linear-gradient(135deg,#FFB6D9 0%,#FFE4F0 25%,#FFF0A0 50%,#FFD4E8 75%,#E8B4FF 100%);
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
  }
  .gyaru-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      radial-gradient(circle at 20% 20%,rgba(255,105,180,0.15) 0%,transparent 50%),
      radial-gradient(circle at 80% 80%,rgba(255,215,0,0.15) 0%,transparent 50%),
      radial-gradient(circle at 50% 50%,rgba(230,170,255,0.1) 0%,transparent 60%);
    pointer-events: none;
    z-index: 0;
  }
  .gyaru-tab-bar {
    background: linear-gradient(90deg,#FF69B4,#FF1493,#FFD700,#FF69B4);
    background-size: 300% 100%;
    animation: gradientShift 4s ease infinite;
    border-bottom: 3px solid #FF1493;
    box-shadow: 0 4px 20px rgba(255,20,147,0.4);
  }
  .gyaru-tab-active {
    background: rgba(255,255,255,0.25) !important;
    border-color: white !important;
    color: white !important;
  }
  .gyaru-tab-inactive {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.3);
    color: rgba(255,255,255,0.75);
  }
  .gyaru-tab-inactive:hover { background: rgba(255,255,255,0.18); }
  .gyaru-header {
    background: linear-gradient(90deg,#FF69B4,#FF1493,#FFD700,#FF69B4);
    background-size: 300% 100%;
    animation: gradientShift 4s ease infinite;
    border-bottom: 3px solid #FF1493;
    box-shadow: 0 4px 20px rgba(255,20,147,0.4);
  }
  .gyaru-card {
    background: rgba(255,255,255,0.88);
    border: 3px solid #FF69B4;
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(255,105,180,0.25),0 2px 8px rgba(255,215,0,0.2);
    backdrop-filter: blur(10px);
    position: relative;
    overflow: hidden;
  }
  .gyaru-card::after {
    content: '';
    position: absolute;
    top: -50%; right: -20%;
    width: 200px; height: 200px;
    background: radial-gradient(circle,rgba(255,215,0,0.08) 0%,transparent 70%);
    pointer-events: none;
  }
  .gyaru-title {
    font-family: 'Luckiest Guy', cursive;
    color: #FF1493;
    text-shadow: 3px 3px 0px #FFD700,5px 5px 0px rgba(255,20,147,0.2);
    letter-spacing: 2px;
  }
  .gyaru-subtitle { font-family: 'Nunito',sans-serif; font-weight: 900; color: #FF69B4; }
  .gyaru-text     { font-family: 'Nunito',sans-serif; color: #8B0057; }
  .gyaru-progress-track {
    height: 12px; border-radius: 9999px;
    background: linear-gradient(90deg,rgba(255,105,180,0.2),rgba(255,215,0,0.2));
    border: 2px solid rgba(255,105,180,0.3);
    overflow: hidden;
  }
  .gyaru-progress-bar {
    height: 100%; border-radius: 9999px;
    background: linear-gradient(90deg,#FF69B4,#FFD700,#FF1493);
    background-size: 200% 100%;
    animation: shimmer 2s linear infinite;
    transition: width 0.8s ease;
  }
  .gyaru-badge {
    background: linear-gradient(90deg,#FF69B4,#FF1493);
    color: white; border-radius: 9999px; padding: 2px 10px;
    font-family: 'Nunito',sans-serif; font-weight: 900; font-size: 11px;
    display: inline-flex; align-items: center; gap: 4px;
    box-shadow: 0 2px 8px rgba(255,20,147,0.3);
  }
  .gyaru-badge-gold {
    background: linear-gradient(90deg,#FFD700,#FFA500);
    color: #8B4513; border-radius: 9999px; padding: 2px 10px;
    font-family: 'Nunito',sans-serif; font-weight: 900; font-size: 11px;
    display: inline-flex; align-items: center; gap: 4px;
    box-shadow: 0 2px 8px rgba(255,215,0,0.4);
  }
  .gyaru-stat-card {
    background: linear-gradient(135deg,rgba(255,255,255,0.9),rgba(255,230,250,0.9));
    border: 2px solid #FFB6D9; border-radius: 16px; padding: 12px;
    text-align: center; box-shadow: 0 4px 15px rgba(255,105,180,0.15); transition: transform 0.2s;
  }
  .gyaru-stat-card:hover { transform: translateY(-2px); }
  .gyaru-japan-item {
    background: linear-gradient(135deg,rgba(255,255,255,0.95),rgba(255,240,255,0.95));
    border: 2px solid #FFB6D9; border-radius: 14px; padding: 12px 14px; transition: all 0.2s;
  }
  .gyaru-japan-item:hover { border-color: #FF69B4; box-shadow: 0 4px 15px rgba(255,105,180,0.2); }
  .gyaru-section-title {
    font-family: 'Luckiest Guy', cursive; color: #FF1493; font-size: 1.3rem;
    text-shadow: 2px 2px 0px #FFD700; letter-spacing: 1px;
    display: flex; align-items: center; gap: 8px; margin-bottom: 16px;
  }
  .gyaru-style-selector {
    display: flex; gap: 8px; margin-bottom: 16px;
  }
  .gyaru-style-btn {
    flex: 1; padding: 8px 12px; border-radius: 12px; border: 2px solid #FFB6D9;
    background: rgba(255,255,255,0.6); font-family: 'Nunito',sans-serif;
    font-weight: 700; font-size: 13px; color: #8B0057; cursor: pointer; transition: all 0.2s;
  }
  .gyaru-style-btn:hover  { border-color: #FF69B4; background: rgba(255,255,255,0.85); }
  .gyaru-style-btn-active { border-color: #FF1493 !important; background: linear-gradient(90deg,rgba(255,105,180,0.2),rgba(255,215,0,0.15)) !important; color: #FF1493 !important; }
  .waifu-deco {
    position: fixed; right: -60px; bottom: 60px; width: 220px;
    opacity: 0.18; pointer-events: none; z-index: 0;
    filter: drop-shadow(0 0 20px #FF69B4);
  }
`;

/* ─── Masculine Anime style (User Profile option) ─── */
const MASCULINE_STYLES = `
  .masc-page {
    background: linear-gradient(135deg,#0A0000 0%,#1A0000 30%,#2D0500 60%,#1A0808 100%);
    min-height: 100vh; position: relative; overflow-x: hidden;
  }
  .masc-page::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      radial-gradient(circle at 15% 20%,rgba(255,69,0,0.12) 0%,transparent 50%),
      radial-gradient(circle at 85% 70%,rgba(255,140,0,0.1) 0%,transparent 50%);
    pointer-events: none; z-index: 0;
  }
  .masc-page::after {
    content: '';
    position: fixed; inset: 0;
    background-image: repeating-linear-gradient(
      0deg,transparent,transparent 40px,rgba(255,69,0,0.03) 40px,rgba(255,69,0,0.03) 41px
    );
    pointer-events: none; z-index: 0;
  }
  .masc-tab-bar {
    background: linear-gradient(90deg,#1A0000,#4A0000,#1A0000);
    border-bottom: 3px solid #FF4500;
    box-shadow: 0 4px 20px rgba(255,69,0,0.5);
  }
  .masc-tab-active   { background: rgba(255,69,0,0.25) !important; border-color: #FF4500 !important; color: #FF6600 !important; }
  .masc-tab-inactive { background: rgba(255,255,255,0.05); border-color: rgba(255,69,0,0.3); color: rgba(255,150,50,0.65); }
  .masc-tab-inactive:hover { background: rgba(255,69,0,0.1); }
  .masc-header {
    background: linear-gradient(90deg,#1A0000,#4A0000,#1A0000);
    border-bottom: 3px solid #FF4500;
    box-shadow: 0 4px 20px rgba(255,69,0,0.5);
  }
  .masc-card {
    background: rgba(20,5,0,0.85);
    border: 2px solid #FF4500;
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(255,69,0,0.25);
    backdrop-filter: blur(8px);
    position: relative; overflow: hidden;
  }
  .masc-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg,transparent,#FF4500,#FF8C00,transparent);
  }
  .masc-title {
    font-family: 'Bebas Neue', 'Impact', sans-serif;
    color: #FF6600;
    text-shadow: 2px 2px 0px #FF0000, 0 0 20px rgba(255,69,0,0.6);
    letter-spacing: 4px;
  }
  .masc-subtitle { font-family: 'Bebas Neue','Impact',sans-serif; color: #FF8C00; letter-spacing: 2px; }
  .masc-text     { font-family: 'Nunito',sans-serif; color: #FFAA66; }
  .masc-progress-track {
    height: 12px; border-radius: 2px;
    background: rgba(255,69,0,0.15);
    border: 1px solid rgba(255,69,0,0.4);
    overflow: hidden;
  }
  .masc-progress-bar {
    height: 100%; border-radius: 2px;
    background: linear-gradient(90deg,#FF0000,#FF6600,#FF8C00);
    background-size: 200% 100%;
    animation: shimmer 2s linear infinite;
    transition: width 0.8s ease;
    box-shadow: 0 0 8px rgba(255,69,0,0.6);
  }
  .masc-badge {
    background: linear-gradient(90deg,#FF4500,#FF0000);
    color: #FFE0CC; border-radius: 4px; padding: 2px 10px;
    font-family: 'Bebas Neue','Impact',sans-serif; font-size: 12px; letter-spacing: 1px;
    display: inline-flex; align-items: center; gap: 4px;
    box-shadow: 0 2px 8px rgba(255,69,0,0.4);
  }
  .masc-badge-gold {
    background: linear-gradient(90deg,#FF8C00,#FF6600);
    color: #FFF0CC; border-radius: 4px; padding: 2px 10px;
    font-family: 'Bebas Neue','Impact',sans-serif; font-size: 12px; letter-spacing: 1px;
    display: inline-flex; align-items: center; gap: 4px;
    box-shadow: 0 2px 8px rgba(255,140,0,0.4);
  }
  .masc-stat-card {
    background: rgba(30,5,0,0.9);
    border: 1px solid #FF4500; border-radius: 6px; padding: 12px;
    text-align: center;
    box-shadow: 0 0 12px rgba(255,69,0,0.15); transition: all 0.2s;
    animation: firePulse 3s ease-in-out infinite;
  }
  .masc-stat-card:hover { transform: translateY(-2px); box-shadow: 0 0 20px rgba(255,69,0,0.35); }
  .masc-japan-item {
    background: rgba(30,5,0,0.8);
    border: 1px solid rgba(255,69,0,0.5); border-radius: 6px;
    padding: 12px 14px; transition: all 0.2s;
  }
  .masc-japan-item:hover { border-color: #FF4500; box-shadow: 0 0 12px rgba(255,69,0,0.3); }
  .masc-section-title {
    font-family: 'Bebas Neue','Impact',sans-serif;
    color: #FF6600; font-size: 1.4rem;
    text-shadow: 1px 1px 0px #FF0000, 0 0 15px rgba(255,69,0,0.4);
    letter-spacing: 3px;
    display: flex; align-items: center; gap: 8px; margin-bottom: 16px;
    border-left: 4px solid #FF4500; padding-left: 10px;
  }
  .masc-style-selector { display: flex; gap: 8px; margin-bottom: 16px; }
  .masc-style-btn {
    flex: 1; padding: 8px 12px; border-radius: 6px; border: 1px solid rgba(255,69,0,0.4);
    background: rgba(30,5,0,0.6); font-family: 'Nunito',sans-serif;
    font-weight: 700; font-size: 13px; color: #FFAA66; cursor: pointer; transition: all 0.2s;
  }
  .masc-style-btn:hover  { border-color: #FF4500; background: rgba(255,69,0,0.1); }
  .masc-style-btn-active { border-color: #FF4500 !important; background: rgba(255,69,0,0.2) !important; color: #FF6600 !important; }
  .waifu-deco-masc {
    position: fixed; right: -40px; bottom: 60px; width: 200px;
    opacity: 0.15; pointer-events: none; z-index: 0;
    filter: drop-shadow(0 0 20px #FF4500) sepia(1) saturate(3) hue-rotate(330deg);
  }
  .fire-spark {
    position: fixed; pointer-events: none; z-index: 0;
    font-size: 18px; animation: floatSpark 5s ease-in-out infinite; opacity: 0.5;
  }
`;

/* ─── Anime style (Developer Profile – fixed) ─── */
const ANIME_STYLES = `
  .anime-page {
    background: linear-gradient(135deg,#050D1A 0%,#0D1B2A 30%,#0A1628 60%,#0D2137 100%);
    min-height: 100vh; position: relative; overflow-x: hidden;
  }
  .anime-page::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      radial-gradient(circle at 20% 20%,rgba(0,212,255,0.07) 0%,transparent 50%),
      radial-gradient(circle at 80% 80%,rgba(99,102,241,0.08) 0%,transparent 50%),
      repeating-linear-gradient(0deg,transparent,transparent 50px,rgba(0,212,255,0.025) 50px,rgba(0,212,255,0.025) 51px),
      repeating-linear-gradient(90deg,transparent,transparent 50px,rgba(0,212,255,0.025) 50px,rgba(0,212,255,0.025) 51px);
    pointer-events: none; z-index: 0;
  }
  .anime-tab-bar {
    background: rgba(5,13,26,0.95);
    border-bottom: 2px solid #00D4FF;
    box-shadow: 0 4px 20px rgba(0,212,255,0.3);
    backdrop-filter: blur(10px);
  }
  .anime-tab-active   { background: rgba(0,212,255,0.15) !important; border-color: #00D4FF !important; color: #00D4FF !important; }
  .anime-tab-inactive { background: rgba(255,255,255,0.04); border-color: rgba(0,212,255,0.2); color: rgba(0,212,255,0.5); }
  .anime-tab-inactive:hover { background: rgba(0,212,255,0.08); }
  .anime-header {
    background: rgba(5,13,26,0.95);
    border-bottom: 2px solid #00D4FF;
    box-shadow: 0 4px 20px rgba(0,212,255,0.3);
    backdrop-filter: blur(10px);
  }
  .anime-card {
    background: rgba(13,27,42,0.9);
    border: 1px solid rgba(0,212,255,0.3);
    border-radius: 12px;
    box-shadow: 0 0 20px rgba(0,212,255,0.1), inset 0 1px 0 rgba(0,212,255,0.1);
    backdrop-filter: blur(10px);
    position: relative; overflow: hidden;
    animation: glowPulse 4s ease-in-out infinite;
  }
  .anime-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg,transparent,#00D4FF,#6366F1,transparent);
  }
  .anime-title {
    font-family: 'Orbitron',monospace;
    color: #00D4FF;
    text-shadow: 0 0 10px rgba(0,212,255,0.6), 0 0 20px rgba(0,212,255,0.3);
    letter-spacing: 3px;
  }
  .anime-subtitle { font-family: 'Orbitron',monospace; color: #6366F1; letter-spacing: 1px; }
  .anime-text     { font-family: 'Nunito',sans-serif; color: #94C6E0; }
  .anime-progress-track {
    height: 8px; border-radius: 9999px;
    background: rgba(0,212,255,0.1);
    border: 1px solid rgba(0,212,255,0.2);
    overflow: hidden;
  }
  .anime-progress-bar {
    height: 100%; border-radius: 9999px;
    background: linear-gradient(90deg,#00D4FF,#6366F1,#A78BFA);
    background-size: 200% 100%;
    animation: shimmer 2s linear infinite;
    transition: width 0.8s ease;
    box-shadow: 0 0 6px rgba(0,212,255,0.6);
  }
  .anime-badge {
    background: rgba(0,212,255,0.15);
    color: #00D4FF; border: 1px solid rgba(0,212,255,0.4);
    border-radius: 6px; padding: 2px 10px;
    font-family: 'Orbitron',monospace; font-size: 10px; letter-spacing: 1px;
    display: inline-flex; align-items: center; gap: 4px;
  }
  .anime-badge-purple {
    background: rgba(99,102,241,0.15);
    color: #A78BFA; border: 1px solid rgba(99,102,241,0.4);
    border-radius: 6px; padding: 2px 10px;
    font-family: 'Orbitron',monospace; font-size: 10px; letter-spacing: 1px;
    display: inline-flex; align-items: center; gap: 4px;
  }
  .anime-stat-card {
    background: rgba(13,27,42,0.95);
    border: 1px solid rgba(0,212,255,0.25); border-radius: 10px; padding: 12px;
    text-align: center;
    box-shadow: 0 0 10px rgba(0,212,255,0.08); transition: all 0.2s;
  }
  .anime-stat-card:hover { border-color: rgba(0,212,255,0.5); box-shadow: 0 0 20px rgba(0,212,255,0.2); transform: translateY(-2px); }
  .anime-japan-item {
    background: rgba(13,27,42,0.9);
    border: 1px solid rgba(0,212,255,0.2); border-radius: 8px;
    padding: 12px 14px; transition: all 0.2s;
  }
  .anime-japan-item:hover { border-color: rgba(0,212,255,0.5); box-shadow: 0 0 12px rgba(0,212,255,0.15); }
  .anime-section-title {
    font-family: 'Orbitron',monospace;
    color: #00D4FF; font-size: 1rem;
    text-shadow: 0 0 8px rgba(0,212,255,0.5);
    letter-spacing: 2px;
    display: flex; align-items: center; gap: 8px; margin-bottom: 16px;
    text-transform: uppercase;
  }
  .anime-section-title::before {
    content: '//';
    color: rgba(0,212,255,0.4);
    font-size: 0.85rem;
  }
  .chibi-deco {
    position: fixed; right: -30px; bottom: 40px; width: 180px;
    opacity: 0.12; pointer-events: none; z-index: 0;
    filter: drop-shadow(0 0 15px #00D4FF) hue-rotate(180deg) brightness(1.5);
  }
  .data-dot {
    position: fixed; pointer-events: none; z-index: 0;
    width: 4px; height: 4px; border-radius: 50%;
    background: #00D4FF;
    animation: floatSpark 7s ease-in-out infinite;
    opacity: 0.3;
  }
`;

const GYARU_SPARKLES = [
  { top: '8%',  left: '5%',  delay: '0s',   icon: '✦' },
  { top: '15%', left: '92%', delay: '1s',   icon: '★' },
  { top: '35%', left: '3%',  delay: '2s',   icon: '✿' },
  { top: '55%', left: '95%', delay: '0.5s', icon: '♥' },
  { top: '70%', left: '7%',  delay: '1.5s', icon: '✦' },
  { top: '85%', left: '90%', delay: '2.5s', icon: '★' },
  { top: '25%', left: '88%', delay: '3s',   icon: '✿' },
  { top: '45%', left: '2%',  delay: '3.5s', icon: '♥' },
];
const MASC_SPARKS = [
  { top: '10%', left: '4%',  delay: '0s',   icon: '🔥' },
  { top: '20%', left: '93%', delay: '1s',   icon: '⚡' },
  { top: '40%', left: '2%',  delay: '2s',   icon: '⚔️' },
  { top: '65%', left: '94%', delay: '0.8s', icon: '🔥' },
  { top: '80%', left: '5%',  delay: '1.6s', icon: '⚡' },
];
const ANIME_DOTS = [
  { top: '12%', left: '8%',  delay: '0s'   },
  { top: '30%', left: '91%', delay: '2s'   },
  { top: '55%', left: '6%',  delay: '1s'   },
  { top: '72%', left: '93%', delay: '3s'   },
  { top: '88%', left: '10%', delay: '1.5s' },
];

/* ─── Style selector component (outside main component to avoid re-creation) ─── */
const StyleSelector = ({ isMasc, setUserStyle }) => {
  const base   = isMasc ? 'masc-style-btn'       : 'gyaru-style-btn';
  const active = isMasc ? 'masc-style-btn-active' : 'gyaru-style-btn-active';
  return (
    <div className={isMasc ? 'masc-style-selector' : 'gyaru-style-selector'}>
      <button className={`${base} ${!isMasc ? active : ''}`} onClick={() => setUserStyle('gyaru')}>
        🌸 Gyaru Style
      </button>
      <button className={`${base} ${isMasc ? active : ''}`} onClick={() => setUserStyle('masculine')}>
        ⚔️ Masculine Anime
      </button>
    </div>
  );
};
const JapanPlansList = ({ plans, cls }) => {
  const total     = plans.length;
  const completed = plans.filter(p => p.status === 'completed').length;
  const inProg    = plans.filter(p => p.status === 'in-progress').length;
  const notStart  = plans.filter(p => p.status === 'not-started').length;
  const pct       = total > 0 ? Math.round((completed / total) * 100) : 0;

  const groups = plans.reduce((acc, plan) => {
    const cat = plan.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(plan);
    return acc;
  }, {});

  if (total === 0) {
    return <p className={`${cls.text} text-center py-4 text-sm font-bold opacity-60`}>No Japan plans added yet~</p>;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <span className={`${cls.text} text-sm font-bold`}>Overall Progress</span>
        <span className={`${cls.title} text-2xl`}>{pct}%</span>
      </div>
      <div className={`${cls.progressTrack} mb-4`}>
        <div className={cls.progressBar} style={{ width: `${pct}%` }} />
      </div>
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Completed',   value: completed, emoji: '✅', bg: 'rgba(0,200,100,0.08)',   border: '#5cb85c' },
          { label: 'In Progress', value: inProg,    emoji: '⏳', bg: 'rgba(255,215,0,0.1)',    border: '#FFD700' },
          { label: 'Not Started', value: notStart,  emoji: '⭕', bg: 'rgba(150,150,150,0.06)', border: 'rgba(150,150,150,0.3)' },
        ].map(({ label, value, emoji, bg, border }) => (
          <div key={label} style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
            <span className="text-xl block mb-0.5">{emoji}</span>
            <p className={`${cls.subtitle} text-xl`}>{value}</p>
            <p className={`${cls.text} text-xs font-bold opacity-70`}>{label}</p>
          </div>
        ))}
      </div>
      {Object.entries(groups).map(([category, items]) => {
        const catDone = items.filter(p => p.status === 'completed').length;
        const catPct  = items.length > 0 ? Math.round((catDone / items.length) * 100) : 0;
        return (
          <div key={category} className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`${cls.subtitle} text-sm`}>{category}</span>
              <span className={cls.badgeAlt}>{catDone}/{items.length} · {catPct}%</span>
            </div>
            <div className={`${cls.progressTrack} mb-3`} style={{ height: '8px' }}>
              <div className={cls.progressBar} style={{ width: `${catPct}%` }} />
            </div>
            <div className="space-y-2">
              {items.map(plan => (
                <div key={plan.id} className={`${cls.planItem} flex items-center gap-3`}>
                  <span className="text-lg flex-shrink-0">{statusIcon[plan.status] || '⭕'}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`${cls.text} text-sm font-bold truncate`}>{plan.title}</p>
                    {plan.subcategory && (
                      <p className={`${cls.text} text-xs opacity-60`}>{plan.subcategory}</p>
                    )}
                  </div>
                  {plan.priority && (
                    <span className="text-base flex-shrink-0" title={plan.priority}>{priorityEmoji[plan.priority] || '⭐'}</span>
                  )}
                  <span className={`${cls.badge} text-xs flex-shrink-0`} style={{ fontSize: '10px' }}>
                    {statusLabel[plan.status] || plan.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <p className={`${cls.text} text-xs text-center opacity-60 mt-2 font-bold`}>
        {completed} of {total} plans completed · Keep going!
      </p>
    </>
  );
};

const PublicProfile = () => {
  /* ── Active profile & style (persisted in localStorage) ── */
  const [activeProfile, setActiveProfile] = useState(
    () => localStorage.getItem('pp_activeProfile') || 'developer'
  );
  const [userStyle, setUserStyle] = useState(
    () => localStorage.getItem('pp_userStyle') || 'gyaru'
  );

  /* ── Developer profile data (real localStorage) ── */
  const [goals]     = useState(() => getData('goals', []));
  const [habits]    = useState(() => getData('habits', []));
  const [japanese]  = useState(() => getData('japanese', null));
  const [studyLog]  = useState(() => getData('studyLog', []));
  const [moodLog]   = useState(() => getData('moodLog', []));
  const [healthLog] = useState(() => getData('healthLog', []));
  const [japanPlans] = useState(() => getData('japanPlans', []));

  /* ── User profile waifu image ── */
  const [waifuImg, setWaifuImg] = useState(null);

  useEffect(() => {
    localStorage.setItem('pp_activeProfile', activeProfile);
  }, [activeProfile]);

  useEffect(() => {
    localStorage.setItem('pp_userStyle', userStyle);
  }, [userStyle]);

  useEffect(() => {
    fetch('https://api.waifu.pics/sfw/waifu')
      .then(r => r.json())
      .then(data => { if (data?.url) setWaifuImg(data.url); })
      .catch(() => {});
  }, []);

  /* ── Developer computed values ── */
  const totalStudyMinutes = studyLog.reduce((sum, s) => sum + (s.duration || 0), 0);
  const studyHours = Math.floor(totalStudyMinutes / 60);
  const studyMins  = totalStudyMinutes % 60;
  const booksRead  = goals.find(g => g.title?.toLowerCase().includes('book'))?.progress ?? 0;
  const maxStreak  = habits.length > 0 ? Math.max(...habits.map(h => h.streak || 0)) : 0;

  const devMoods  = moodLog.slice(0, 7).reverse();
  const moodCounts = moodLog.reduce((acc, e) => { acc[e.mood] = (acc[e.mood] || 0) + 1; return acc; }, {});
  const topMood   = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

  const recentHealth  = healthLog.slice(0, 7);
  const waterGoal     = 8;
  const avgWater      = recentHealth.length > 0 ? Math.round(recentHealth.reduce((s, e) => s + (e.water || 0), 0) / recentHealth.length) : 0;
  const avgExercise   = recentHealth.length > 0 ? Math.round(recentHealth.reduce((s, e) => s + (e.exercise || 0), 0) / recentHealth.length) : 0;
  const totalExerciseMin = healthLog.reduce((s, e) => s + (e.exercise || 0), 0);

  /* ── Mock computed values for User Profile ── */
  const mockMoodCounts = MOCK_MOODS.reduce((acc, e) => { acc[e.mood] = (acc[e.mood] || 0) + 1; return acc; }, {});
  const mockTopMood    = Object.entries(mockMoodCounts).sort((a, b) => b[1] - a[1])[0];

  /* ── Tab switcher ── */
  const isDevProfile = activeProfile === 'developer';

  /* ── Shared tab bar render ── */
  const renderTabBar = (tabBarClass, activeClass, inactiveClass) => (
    <div className={`${tabBarClass} profile-tab-bar`}>
      <button
        className={`profile-tab ${isDevProfile ? activeClass : inactiveClass}`}
        onClick={() => setActiveProfile('developer')}
      >
        <Code2 size={14} /> Developer Profile
      </button>
      <button
        className={`profile-tab ${!isDevProfile ? activeClass : inactiveClass}`}
        onClick={() => setActiveProfile('user')}
      >
        <User size={14} /> User Profile
      </button>
    </div>
  );

  /* ══════════════════════════════════════════════
     DEVELOPER PROFILE — Anime Style (dark blue)
  ══════════════════════════════════════════════ */
  if (isDevProfile) {
    const devGoals = goals.length > 0 ? goals : [
      { id: 1, title: 'Pass JLPT N3',              progress: 65, target: 100 },
      { id: 2, title: 'Read 24 books this year',    progress: 5,  target: 24  },
      { id: 3, title: 'Build 3 portfolio projects', progress: 1,  target: 3   },
    ];
    const animeJapanCls = {
      text:         'anime-text',
      title:        'anime-title',
      subtitle:     'anime-subtitle',
      badge:        'anime-badge',
      badgeAlt:     'anime-badge-purple',
      progressTrack:'anime-progress-track',
      progressBar:  'anime-progress-bar',
      planItem:     'anime-japan-item',
    };
    return (
      <div className="anime-page">
        <style>{SHARED_STYLES}{ANIME_STYLES}</style>

        {/* Data dots */}
        {ANIME_DOTS.map((d, i) => (
          <span key={i} className="data-dot" style={{ top: d.top, left: d.left, animationDelay: d.delay }} />
        ))}

        {/* Chibi deco — same waifu image with blue filter */}
        {waifuImg && <img src={waifuImg} alt="" className="chibi-deco" aria-hidden="true" />}

        {/* Tab bar */}
        {renderTabBar('anime-tab-bar', 'anime-tab-active', 'anime-tab-inactive')}

        {/* Header */}
        <header className="anime-header sticky top-0 z-20 px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bounce-gentle"
              style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.4)' }}>
              <span className="anime-title text-xs">⬡</span>
            </div>
            <span className="anime-title text-lg">LifeOS</span>
            <span className="anime-badge ml-1"><Globe size={10} />Public</span>
          </div>
          <span className="anime-badge-purple">✦ Developer Profile ✦</span>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-8 space-y-6 pb-16 relative z-10">

          {/* Profile Card */}
          <div className="anime-card p-8 text-center">
            <div className="flex justify-center mb-5 relative">
              <div className="relative inline-block">
                <img
                  src={`${import.meta.env.BASE_URL}profile.png`}
                  alt="Zizou"
                  className="w-28 h-28 rounded-full object-cover"
                  style={{ border: '3px solid #00D4FF', boxShadow: '0 0 20px rgba(0,212,255,0.5), 0 0 40px rgba(99,102,241,0.3)' }}
                  onError={e => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="w-28 h-28 rounded-full items-center justify-center hidden"
                  style={{ background: 'linear-gradient(135deg,#00D4FF,#6366F1)', border: '3px solid #00D4FF' }}
                  aria-hidden="true">
                  <span className="text-white text-4xl font-bold" style={{ fontFamily: "'Orbitron',monospace" }}>Z</span>
                </div>
                <span className="absolute -top-1 -right-1 text-lg bounce-gentle">💻</span>
              </div>
            </div>
            <h1 className="anime-title text-3xl">ZIZOU</h1>
            <p className="anime-text font-bold mt-2 text-sm tracking-wider">Developer · Japanese Learner · Builder</p>
            <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
              <span className="anime-badge"><Globe size={10} />@Developer Profile</span>
              <span className="anime-badge-purple">⚡ JLPT N3 STUDENT</span>
              <span className="anime-badge">🛠 LifeOS Creator</span>
            </div>
            <p className="anime-text text-xs mt-3 opacity-50 tracking-widest">— REAL DATA FROM LOCALSTORAGE —</p>
          </div>

          {/* Stats Grid */}
          <div>
            <div className="anime-section-title">ACTIVITY STATS</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Habits',        value: habits.length   || '—',  emoji: '🎯' },
                { label: 'Goals',         value: goals.length    || '—',  emoji: '🏆' },
                { label: 'Japanese LVL',  value: japanese?.currentLevel || 'N3', emoji: '📚' },
                { label: 'Study Time',    value: totalStudyMinutes > 0 ? `${studyHours}h ${studyMins}m` : '—', emoji: '⏰' },
                { label: 'Max Streak',    value: maxStreak > 0 ? `${maxStreak}d` : '—', emoji: '🔥' },
                { label: 'Books Read',    value: booksRead > 0 ? booksRead : '—', emoji: '📖' },
              ].map(({ label, value, emoji }) => (
                <div key={label} className="anime-stat-card">
                  <span className="text-2xl block mb-1">{emoji}</span>
                  <p className="anime-subtitle text-lg leading-tight">{value}</p>
                  <p className="anime-text text-xs mt-0.5 opacity-70 tracking-wider">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Japan Plans */}
          <div className="anime-card p-5">
            <div className="anime-section-title">🇯🇵 MYJAPAN PLANS</div>
            <JapanPlansList plans={japanPlans} cls={animeJapanCls} />
          </div>

          {/* Mood Trends */}
          <div className="anime-card p-5">
            <div className="anime-section-title">
              <Heart size={14} style={{ color: '#6366F1' }} /> MOOD TRENDS
              {topMood && <span className="anime-badge-purple ml-auto">Top: {moodEmoji[topMood[0]] || '😊'} {topMood[0]}</span>}
            </div>
            {devMoods.length === 0 ? (
              <p className="anime-text text-sm text-center py-4 opacity-60">No mood data recorded yet.</p>
            ) : (
              <div className="flex items-end gap-2 h-20">
                {devMoods.map((entry, i) => (
                  <div key={entry.id ?? i} className="flex flex-col items-center gap-1 flex-1">
                    <span className="text-base leading-none">{entry.emoji || moodEmoji[entry.mood] || '😊'}</span>
                    <div className="w-full rounded-t-sm"
                      style={{ height: `${(entry.intensity / 5) * 40 + 8}px`, background: 'linear-gradient(to top,#00D4FF,#6366F1)', opacity: 0.7 }} />
                    <span className="anime-text text-xs truncate w-full text-center opacity-60">{entry.date?.slice(5)}</span>
                  </div>
                ))}
              </div>
            )}
            {moodLog.length > 0 && (
              <div className="mt-3 pt-3 flex flex-wrap gap-2" style={{ borderTop: '1px solid rgba(0,212,255,0.15)' }}>
                {Object.entries(moodCounts).sort((a, b) => b[1] - a[1]).map(([mood, count]) => (
                  <span key={mood} className="anime-text text-xs opacity-70">{moodEmoji[mood] || '😊'} {mood} ×{count}</span>
                ))}
              </div>
            )}
          </div>

          {/* Health Stats */}
          <div className="anime-card p-5">
            <div className="anime-section-title"><Droplets size={14} style={{ color: '#00D4FF' }} /> HEALTH DATA</div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Droplets size={13} style={{ color: '#4FC3F7' }} />
                  <span className="anime-text text-sm font-bold">Water Intake</span>
                  <span className="ml-auto anime-badge text-xs">
                    {healthLog.length > 0 ? `${avgWater}/${waterGoal} cups avg` : '— / 8 cups'}
                  </span>
                </div>
                <div className="anime-progress-track">
                  <div className="anime-progress-bar" style={{ width: `${Math.min(100, (avgWater / waterGoal) * 100)}%`, background: 'linear-gradient(90deg,#4FC3F7,#0288D1)' }} />
                </div>
                {healthLog.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {healthLog.slice(0, 7).reverse().map((entry, i) => (
                      <div key={entry.id ?? i} className="flex flex-col items-center gap-0.5">
                        <span className="text-sm">{entry.water >= waterGoal ? '💧' : '🫗'}</span>
                        <span className="anime-text text-xs opacity-60">{entry.date?.slice(5)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Dumbbell size={13} style={{ color: '#66BB6A' }} />
                  <span className="anime-text text-sm font-bold">Exercise</span>
                  <span className="ml-auto anime-badge text-xs">
                    {healthLog.length > 0 ? `${avgExercise} min/day · ${Math.floor(totalExerciseMin / 60)}h total` : '— min/day'}
                  </span>
                </div>
                <div className="anime-progress-track">
                  <div className="anime-progress-bar" style={{ width: `${Math.min(100, (avgExercise / 60) * 100)}%`, background: 'linear-gradient(90deg,#66BB6A,#43A047)' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Goals Progress */}
          <div className="anime-card p-5">
            <div className="anime-section-title"><Target size={14} style={{ color: '#00D4FF' }} /> GOALS</div>
            <div className="space-y-4">
              {devGoals.map(goal => {
                const pct = Math.min(100, Math.round((goal.progress / goal.target) * 100));
                return (
                  <div key={goal.id}>
                    <div className="flex justify-between mb-1.5">
                      <span className="anime-text text-sm font-bold">{goal.title}</span>
                      <span className="anime-badge">{pct}%</span>
                    </div>
                    <div className="anime-progress-track">
                      <div className="anime-progress-bar" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Spotify */}
          <div className="anime-card p-5 overflow-hidden">
            <div className="anime-section-title"><Music2 size={14} style={{ color: '#00D4FF' }} /> NOW PLAYING</div>
            <iframe
              data-testid="embed-iframe"
              style={{ borderRadius: '8px', border: '1px solid rgba(0,212,255,0.4)', boxShadow: '0 4px 20px rgba(0,212,255,0.2)' }}
              src={`https://open.spotify.com/embed/album/${MJ_ALBUM_ID}?utm_source=generator`}
              width="100%" height="352"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Michael Jackson Album"
            />
          </div>

          <p className="anime-text text-center text-xs pb-4 opacity-40 tracking-widest">
            // READ-ONLY DEVELOPER PROFILE // POWERED BY LIFEOS //
          </p>
        </main>
      </div>
    );
  }

  /* ══════════════════════════════════════════════
     USER PROFILE — Gyaru or Masculine Anime
  ══════════════════════════════════════════════ */
  const isMasc = userStyle === 'masculine';

  const userJapanCls = isMasc ? {
    text:         'masc-text',
    title:        'masc-title',
    subtitle:     'masc-subtitle',
    badge:        'masc-badge',
    badgeAlt:     'masc-badge-gold',
    progressTrack:'masc-progress-track',
    progressBar:  'masc-progress-bar',
    planItem:     'masc-japan-item',
  } : {
    text:         'gyaru-text',
    title:        'gyaru-title',
    subtitle:     'gyaru-subtitle',
    badge:        'gyaru-badge',
    badgeAlt:     'gyaru-badge-gold',
    progressTrack:'gyaru-progress-track',
    progressBar:  'gyaru-progress-bar',
    planItem:     'gyaru-japan-item',
  };



  if (isMasc) {
    return (
      <div className="masc-page">
        <style>{SHARED_STYLES}{MASCULINE_STYLES}</style>

        {/* Fire sparks */}
        {MASC_SPARKS.map((s, i) => (
          <span key={i} className="fire-spark" style={{ top: s.top, left: s.left, animationDelay: s.delay }}>{s.icon}</span>
        ))}

        {waifuImg && <img src={waifuImg} alt="" className="waifu-deco-masc" aria-hidden="true" />}

        {/* Tab bar */}
        {renderTabBar('masc-tab-bar', 'masc-tab-active', 'masc-tab-inactive')}

        {/* Header */}
        <header className="masc-header sticky top-0 z-20 px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded flex items-center justify-center bounce-gentle"
              style={{ background: 'rgba(255,69,0,0.2)', border: '1px solid rgba(255,69,0,0.5)' }}>
              <span style={{ color: '#FF4500', fontWeight: 900, fontSize: '14px' }}>⚡</span>
            </div>
            <span className="masc-title text-2xl">LifeOS</span>
            <span className="masc-badge ml-1"><Globe size={10} />PUBLIC</span>
          </div>
          <span className="masc-badge-gold">⚔️ USER PROFILE ⚔️</span>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-8 space-y-6 pb-16 relative z-10">

          {/* Style Selector */}
          <div className="masc-card p-4">
            <p className="masc-text text-xs mb-3 opacity-60 tracking-widest">SELECT VISUAL STYLE</p>
            <StyleSelector isMasc={true} setUserStyle={setUserStyle} />
          </div>

          {/* Profile Card */}
          <div className="masc-card p-8 text-center">
            <div className="flex justify-center mb-5">
              <div className="relative inline-block">
                <div className="w-28 h-28 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#4A0000,#FF4500)', border: '3px solid #FF4500', boxShadow: '0 0 25px rgba(255,69,0,0.6)' }}>
                  <span style={{ fontSize: '48px' }}>⚔️</span>
                </div>
                <span className="absolute -top-1 -right-1 text-lg">🔥</span>
              </div>
            </div>
            <h1 className="masc-title text-4xl">WARRIOR</h1>
            <p className="masc-text font-bold mt-2 text-sm tracking-widest">LIFE TRACKER · SAMURAI SPIRIT</p>
            <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
              <span className="masc-badge"><Globe size={10} />@User Profile</span>
              <span className="masc-badge-gold">🔥 JLPT CHALLENGER</span>
            </div>
            <p className="masc-text text-xs mt-3 opacity-40 tracking-widest">— DEMO PROFILE —</p>
          </div>

          {/* Stats Grid */}
          <div>
            <div className="masc-section-title">⚡ BATTLE STATS</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Habits',       value: MOCK_HABITS.length,  emoji: '🎯' },
                { label: 'Goals',        value: MOCK_GOALS.length,   emoji: '🏆' },
                { label: 'Japanese LVL', value: 'N3',                emoji: '📚' },
                { label: 'Study Time',   value: '5h 45m',            emoji: '⏰' },
                { label: 'Max Streak',   value: '14d',               emoji: '🔥' },
                { label: 'Books Read',   value: '5 / year',          emoji: '📖' },
              ].map(({ label, value, emoji }) => (
                <div key={label} className="masc-stat-card">
                  <span className="text-2xl block mb-1">{emoji}</span>
                  <p className="masc-subtitle text-xl leading-tight">{value}</p>
                  <p className="masc-text text-xs mt-0.5 opacity-70 tracking-wider">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Japan Plans */}
          <div className="masc-card p-5">
            <div className="masc-section-title">🇯🇵 JAPAN MISSION</div>
            <JapanPlansList plans={MOCK_JAPAN_PLANS} cls={userJapanCls} />
          </div>

          {/* Mood */}
          <div className="masc-card p-5">
            <div className="masc-section-title">
              <Heart size={14} style={{ color: '#FF4500' }} /> BATTLE SPIRIT
              {mockTopMood && <span className="masc-badge-gold ml-auto">DOMINANT: {moodEmoji[mockTopMood[0]] || '😊'}</span>}
            </div>
            <div className="flex items-end gap-2 h-20">
              {MOCK_MOODS.slice().reverse().map((entry, i) => (
                <div key={entry.id ?? i} className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-base leading-none">{entry.emoji}</span>
                  <div className="w-full"
                    style={{ height: `${(entry.intensity / 5) * 40 + 8}px`, background: 'linear-gradient(to top,#FF0000,#FF8C00)', borderRadius: '2px 2px 0 0', opacity: 0.75 }} />
                  <span className="masc-text text-xs truncate w-full text-center opacity-60">{entry.date?.slice(5)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className="masc-card p-5">
            <div className="masc-section-title"><Target size={14} style={{ color: '#FF4500' }} /> OBJECTIVES</div>
            <div className="space-y-4">
              {MOCK_GOALS.map(goal => {
                const pct = Math.min(100, Math.round((goal.progress / goal.target) * 100));
                return (
                  <div key={goal.id}>
                    <div className="flex justify-between mb-1.5">
                      <span className="masc-text text-sm font-bold">{goal.title}</span>
                      <span className="masc-badge">{pct}%</span>
                    </div>
                    <div className="masc-progress-track">
                      <div className="masc-progress-bar" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Spotify */}
          <div className="masc-card p-5 overflow-hidden">
            <div className="masc-section-title"><Music2 size={14} style={{ color: '#FF4500' }} /> NOW PLAYING</div>
            <iframe
              data-testid="embed-iframe"
              style={{ borderRadius: '4px', border: '2px solid rgba(255,69,0,0.5)', boxShadow: '0 4px 20px rgba(255,69,0,0.25)' }}
              src={`https://open.spotify.com/embed/album/${MJ_ALBUM_ID}?utm_source=generator`}
              width="100%" height="352"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Michael Jackson Album"
            />
          </div>

          <p className="masc-text text-center text-xs pb-4 opacity-40 tracking-widest">
            ⚔️ DEMO PROFILE — POWERED BY LIFEOS ⚔️
          </p>
        </main>
      </div>
    );
  }

  /* ── Gyaru User Profile (default) ── */
  return (
    <div className="gyaru-page" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <style>{SHARED_STYLES}{GYARU_STYLES}</style>

      {GYARU_SPARKLES.map((s, i) => (
        <span key={i} className="sparkle"
          style={{ top: s.top, left: s.left, animationDelay: s.delay, fontSize: '18px', color: i % 2 === 0 ? '#FF69B4' : '#FFD700' }}>
          {s.icon}
        </span>
      ))}

      {waifuImg && <img src={waifuImg} alt="" className="waifu-deco" aria-hidden="true" />}

      {/* Tab bar */}
      {renderTabBar('gyaru-tab-bar', 'gyaru-tab-active', 'gyaru-tab-inactive')}

      {/* Header */}
      <header className="gyaru-header sticky top-0 z-20 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white/30 flex items-center justify-center shadow-lg bounce-gentle">
            <span className="text-white font-bold text-sm">✦</span>
          </div>
          <span className="gyaru-title text-lg">LifeOS</span>
          <span className="gyaru-badge ml-1"><Globe size={10} />Public</span>
        </div>
        <span className="gyaru-badge-gold">✨ User Profile ✨</span>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6 pb-16 relative z-10">

        {/* Style Selector */}
        <div className="gyaru-card p-4">
          <p className="gyaru-text text-xs mb-3 font-bold opacity-60">✨ Choose your style ✨</p>
          <StyleSelector isMasc={false} setUserStyle={setUserStyle} />
        </div>

        {/* Profile Card */}
        <div className="gyaru-card p-8 text-center">
          <div className="flex justify-center mb-4 relative">
            <div className="relative inline-block">
              {waifuImg ? (
                <img src={waifuImg} alt="User" className="w-28 h-28 rounded-full object-cover shadow-xl"
                  style={{ border: '4px solid #FF69B4', boxShadow: '0 0 20px rgba(255,105,180,0.5)' }} />
              ) : (
                <div className="w-28 h-28 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#FF69B4,#FFD700)', border: '4px solid #FF1493' }}>
                  <span className="text-white text-5xl">🌸</span>
                </div>
              )}
              <span className="absolute -top-1 -right-1 text-xl bounce-gentle">✨</span>
            </div>
          </div>
          <h1 className="gyaru-title text-4xl">Kawaii User</h1>
          <p className="gyaru-text font-bold mt-2 text-sm">Personal Growth Journey 🌸✨</p>
          <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
            <span className="gyaru-badge"><Globe size={10} />@User Profile</span>
            <span className="gyaru-badge-gold">🌸 JLPT N3 Student 🌸</span>
          </div>
          <p className="gyaru-text text-xs mt-3 opacity-50 font-bold">— Demo Profile —</p>
        </div>

        {/* Activity Recap */}
        <div>
          <div className="gyaru-section-title">📈 Activity Recap</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Total Habits', value: MOCK_HABITS.length, emoji: '🎯' },
              { label: 'Total Goals',  value: MOCK_GOALS.length,  emoji: '🏆' },
              { label: 'Japanese Level', value: 'N3',             emoji: '📚' },
              { label: 'Books Read',   value: '5 this year',      emoji: '📖' },
              { label: 'Study Time',   value: '5h 45m',           emoji: '⏰' },
              { label: 'Streak 🔥',    value: '14 days',          emoji: '🔥' },
            ].map(({ label, value, emoji }) => (
              <div key={label} className="gyaru-stat-card">
                <span className="text-2xl block mb-1">{emoji}</span>
                <p className="gyaru-subtitle text-lg leading-tight">{value}</p>
                <p className="gyaru-text text-xs mt-0.5 font-bold opacity-70">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* MYJapan Plans */}
        <div className="gyaru-card p-5">
          <div className="gyaru-section-title">🇯🇵 MYJapan Plans</div>
          <JapanPlansList plans={MOCK_JAPAN_PLANS} cls={userJapanCls} />
        </div>

        {/* Mood Trends */}
        <div className="gyaru-card p-5">
          <div className="gyaru-section-title">
            <Heart size={18} style={{ color: '#FF69B4' }} />😊 Mood Trends
            {mockTopMood && <span className="gyaru-badge-gold ml-auto">Top: {moodEmoji[mockTopMood[0]] || '😊'} {mockTopMood[0]}</span>}
          </div>
          <div className="flex items-end gap-2 h-20">
            {MOCK_MOODS.slice().reverse().map((entry, i) => (
              <div key={entry.id ?? i} className="flex flex-col items-center gap-1 flex-1">
                <span className="text-lg leading-none">{entry.emoji}</span>
                <div className="w-full rounded-t-md"
                  style={{ height: `${(entry.intensity / 5) * 40 + 8}px`, background: 'linear-gradient(to top,#FF69B4,#FFD700)', opacity: 0.75 }} />
                <span className="gyaru-text text-xs truncate w-full text-center font-bold opacity-60">{entry.date?.slice(5)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 flex flex-wrap gap-2" style={{ borderTop: '2px dashed #FFB6D9' }}>
            {Object.entries(mockMoodCounts).sort((a, b) => b[1] - a[1]).map(([mood, count]) => (
              <span key={mood} className="gyaru-text text-xs font-bold">
                {moodEmoji[mood] || '😊'} {mood} ×{count}
              </span>
            ))}
          </div>
        </div>

        {/* Goals Progress */}
        <div className="gyaru-card p-5">
          <div className="gyaru-section-title">🎯 Goals Progress</div>
          <div className="space-y-4">
            {MOCK_GOALS.map(goal => {
              const pct = Math.min(100, Math.round((goal.progress / goal.target) * 100));
              return (
                <div key={goal.id}>
                  <div className="flex justify-between mb-1.5">
                    <span className="gyaru-text text-sm font-bold">{goal.title}</span>
                    <span className="gyaru-badge">{pct}%</span>
                  </div>
                  <div className="gyaru-progress-track">
                    <div className="gyaru-progress-bar" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Spotify */}
        <div className="gyaru-card p-5 overflow-hidden">
          <div className="gyaru-section-title">
            <Music2 size={18} style={{ color: '#FF69B4' }} />🎵 NOW PLAYING
          </div>
          <iframe
            data-testid="embed-iframe"
            style={{ borderRadius: '16px', border: '3px solid #FF69B4', boxShadow: '0 4px 20px rgba(255,105,180,0.3)' }}
            src={`https://open.spotify.com/embed/album/${MJ_ALBUM_ID}?utm_source=generator`}
            width="100%" height="352"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Michael Jackson Album"
          />
        </div>

        <p className="gyaru-text text-center text-sm pb-4 font-bold opacity-70">
          ✦ Demo profile ✦ Powered by LifeOS ✦ うちら最強！✦
        </p>
      </main>
    </div>
  );
};

export default PublicProfile;

