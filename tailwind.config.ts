import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '1.5rem',
			screens: {
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1200px',
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				display: ['Outfit', 'sans-serif'],
				mono: ['JetBrains Mono', 'monospace'],
			},
			colors: {
				// Cosmic Protocol — Primary
				'cosmic-blue': '#0088FF',
				'plasma-purple': '#6B3FA0',
				'void': '#080812',

				// Accents
				'chain-gold': '#F5A623',
				'live-red': '#FF3B30',

				// Neutrals
				'surface': '#12122A',
				'surface-light': '#1A1A3A',
				'border-subtle': '#1E1E3F',
				'muted-text': '#8888AA',
				'bright-text': '#E8E8F0',

				// Semantic (shadcn compat)
				border: '#1E1E3F',
				input: '#1E1E3F',
				ring: '#0088FF',
				background: '#080812',
				foreground: '#E8E8F0',
				primary: {
					DEFAULT: '#0088FF',
					foreground: '#080812'
				},
				secondary: {
					DEFAULT: '#6B3FA0',
					foreground: '#E8E8F0'
				},
				accent: {
					DEFAULT: '#F5A623',
					foreground: '#080812'
				},
				destructive: {
					DEFAULT: '#FF3B30',
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: '#1E1E3F',
					foreground: '#8888AA'
				},
				popover: {
					DEFAULT: '#12122A',
					foreground: '#E8E8F0'
				},
				card: {
					DEFAULT: '#12122A',
					foreground: '#E8E8F0'
				},
			},
			borderRadius: {
				lg: '12px',
				md: '8px',
				sm: '4px',
				xl: '16px',
				'2xl': '20px',
				'3xl': '24px',
			},
			fontSize: {
				'display-xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '800' }],
				'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '800' }],
				'display-md': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
				'display-sm': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.015em', fontWeight: '700' }],
			},
			boxShadow: {
				'glow-blue': '0 0 40px rgba(0, 136, 255, 0.15)',
				'glow-purple': '0 0 40px rgba(107, 63, 160, 0.15)',
				'glow-gold': '0 0 40px rgba(245, 166, 35, 0.15)',
				'card': '0 4px 24px rgba(0, 0, 0, 0.3)',
				'card-hover': '0 8px 40px rgba(0, 136, 255, 0.1)',
				'elevated': '0 20px 60px rgba(0, 0, 0, 0.5)',
			},
			backgroundImage: {
				'gradient-cosmic': 'linear-gradient(135deg, #0088FF 0%, #6B3FA0 100%)',
				'gradient-gold': 'linear-gradient(135deg, #F5A623 0%, #FF6B35 100%)',
				'gradient-subtle': 'linear-gradient(180deg, rgba(0, 136, 255, 0.05) 0%, rgba(107, 63, 160, 0.05) 100%)',
				'gradient-mesh': 'radial-gradient(ellipse at 20% 50%, rgba(0, 136, 255, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(107, 63, 160, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(245, 166, 35, 0.04) 0%, transparent 50%)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-up': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				'scale-in': {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' },
				},
				'slide-in': {
					'0%': { opacity: '0', transform: 'translateX(-20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' },
				},
				'pulse-live': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' },
				},
				'gradient-shift': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' },
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-up': 'fade-up 0.6s ease-out forwards',
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'scale-in': 'scale-in 0.5s ease-out forwards',
				'slide-in': 'slide-in 0.5s ease-out forwards',
				'pulse-live': 'pulse-live 2s ease-in-out infinite',
				'gradient-shift': 'gradient-shift 8s ease infinite',
				'float': 'float 6s ease-in-out infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
