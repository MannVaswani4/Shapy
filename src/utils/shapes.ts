import { ShapeType, ColorType } from '../store/gameStore';

export const COLOR_MAP: Record<ColorType, { bg: string; border: string; glow: string; hex: string }> = {
  red: {
    bg: 'bg-rose-500',
    border: 'border-rose-300',
    glow: 'shadow-[0_0_15px_rgba(244,63,94,0.6)]',
    hex: '#f43f5e',
  },
  blue: {
    bg: 'bg-blue-600',
    border: 'border-blue-300',
    glow: 'shadow-[0_0_15px_rgba(37,99,235,0.6)]',
    hex: '#2563eb',
  },
  green: {
    bg: 'bg-emerald-500',
    border: 'border-emerald-300',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.6)]',
    hex: '#10b981',
  },
  yellow: {
    bg: 'bg-amber-400',
    border: 'border-amber-200',
    glow: 'shadow-[0_0_15px_rgba(251,191,36,0.6)]',
    hex: '#fbbf24',
  },
  orange: {
    bg: 'bg-orange-500',
    border: 'border-orange-300',
    glow: 'shadow-[0_0_15px_rgba(249,115,22,0.6)]',
    hex: '#f97316',
  },
  purple: {
    bg: 'bg-purple-600',
    border: 'border-purple-300',
    glow: 'shadow-[0_0_15px_rgba(147,51,234,0.6)]',
    hex: '#9333ea',
  },
};

export const SHAPE_LIST: ShapeType[] = ['circle', 'square', 'triangle', 'rectangle', 'star', 'hexagon'];
export const COLOR_LIST: ColorType[] = ['red', 'blue', 'green', 'yellow', 'orange', 'purple'];

export const renderShapeSvg = (shape: ShapeType, colorHex: string, size = 48) => {
  const s = size;
  const strokeColor = '#ffffff';
  const strokeW = 3;

  switch (shape) {
    case 'circle':
      return `
        <svg width="${s}" height="${s}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="44" fill="${colorHex}" stroke="${strokeColor}" stroke-width="${strokeW}" />
          <circle cx="35" cy="35" r="8" fill="white" fill-opacity="0.5" />
        </svg>
      `;
    case 'square':
      return `
        <svg width="${s}" height="${s}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="8" width="84" height="84" rx="16" fill="${colorHex}" stroke="${strokeColor}" stroke-width="${strokeW}" />
          <rect x="22" y="22" width="16" height="12" rx="6" fill="white" fill-opacity="0.5" />
        </svg>
      `;
    case 'triangle':
      return `
        <svg width="${s}" height="${s}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 8L92 84H8L50 8Z" fill="${colorHex}" stroke="${strokeColor}" stroke-width="${strokeW}" stroke-linejoin="round" />
          <circle cx="50" cy="35" r="6" fill="white" fill-opacity="0.5" />
        </svg>
      `;
    case 'rectangle':
      return `
        <svg width="${s}" height="${s}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="25" width="92" height="50" rx="12" fill="${colorHex}" stroke="${strokeColor}" stroke-width="${strokeW}" />
          <rect x="18" y="35" width="20" height="8" rx="4" fill="white" fill-opacity="0.5" />
        </svg>
      `;
    case 'star':
      return `
        <svg width="${s}" height="${s}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 5L63.5 35H95L69.5 53.5L79 85L50 66.5L21 85L30.5 53.5L5 35H36.5L50 5Z" fill="${colorHex}" stroke="${strokeColor}" stroke-width="${strokeW}" stroke-linejoin="round" />
          <circle cx="50" cy="38" r="5" fill="white" fill-opacity="0.6" />
        </svg>
      `;
    case 'hexagon':
      return `
        <svg width="${s}" height="${s}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M25 8H75L95 50L75 92H25L5 50L25 8Z" fill="${colorHex}" stroke="${strokeColor}" stroke-width="${strokeW}" stroke-linejoin="round" />
          <circle cx="35" cy="30" r="7" fill="white" fill-opacity="0.5" />
        </svg>
      `;
    default:
      return '';
  }
};
