
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
			padding: '2.8rem', // Increased from 2rem (40% more)
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
			// Enhanced spacing scale with 40% larger values
			spacing: {
				'17': '4.25rem', // For larger gaps (gap-17)
				'22': '5.5rem',  // For section padding (py-22)
				'28': '7rem',    // For section padding (py-28)
			},
			// Enhanced typography scale
			fontSize: {
				'xs': ['0.75rem', { lineHeight: '1.5' }],
				'sm': ['0.875rem', { lineHeight: '1.6' }],
				'base': ['1rem', { lineHeight: '1.6' }],
				'lg': ['1.125rem', { lineHeight: '1.6' }],
				'xl': ['1.25rem', { lineHeight: '1.6' }],
				'2xl': ['1.5rem', { lineHeight: '1.4' }],
				'3xl': ['1.875rem', { lineHeight: '1.3' }],
				'4xl': ['2.25rem', { lineHeight: '1.2' }],
				'5xl': ['3rem', { lineHeight: '1.1' }],
				'6xl': ['3.75rem', { lineHeight: '1.1' }],
				'7xl': ['4.5rem', { lineHeight: '1.05' }],
				'8xl': ['6rem', { lineHeight: '1' }],
				'9xl': ['8rem', { lineHeight: '1' }],
			},
			// Enhanced font weights
			fontWeight: {
				'thin': '100',
				'extralight': '200',
				'light': '300',
				'normal': '400',
				'medium': '500',
				'semibold': '600',
				'bold': '700',
				'extrabold': '800',
				'black': '900',
			},
			colors: {
				border: 'hsl(270, 100%, 15%)', // Electric purple border
				input: 'hsl(270, 100%, 15%)',
				ring: 'hsl(195, 100%, 50%)', // Electric blue for focus rings
				background: 'hsl(240, 100%, 4%)', // Deep space background
				foreground: 'hsl(0, 0%, 100%)',
				primary: {
					DEFAULT: 'hsl(195, 100%, 50%)', // Electric blue as primary
					foreground: 'hsl(240, 100%, 4%)'
				},
				secondary: {
					DEFAULT: 'hsl(270, 100%, 25%)', // Electric purple
					foreground: 'hsl(0, 0%, 100%)'
				},
				accent: {
					DEFAULT: 'hsl(180, 100%, 50%)', // Cyan accent
					foreground: 'hsl(240, 100%, 4%)'
				},
				destructive: {
					DEFAULT: 'hsl(0, 100%, 50%)',
					foreground: 'hsl(0, 0%, 100%)'
				},
				muted: {
					DEFAULT: 'hsl(270, 100%, 15%)',
					foreground: 'hsl(0, 0%, 70%)'
				},
				popover: {
					DEFAULT: 'hsl(240, 100%, 8%)',
					foreground: 'hsl(0, 0%, 100%)'
				},
				card: {
					DEFAULT: 'hsl(240, 100%, 6%)',
					foreground: 'hsl(0, 0%, 100%)'
				},
				// Neon-cosmic brand colors
				'electric-blue': 'hsl(195, 100%, 50%)',
				'electric-cyan': 'hsl(180, 100%, 50%)',
				'electric-purple': 'hsl(270, 100%, 50%)',
				'cosmic-white': 'hsl(0, 0%, 100%)',
				'neon-orange': 'hsl(24, 100%, 50%)',
				'electric-yellow': 'hsl(54, 100%, 50%)',
				'deep-space': 'hsl(240, 100%, 4%)',
				'cosmic-purple': 'hsl(270, 100%, 25%)',
				'neon-green': 'hsl(120, 100%, 50%)',
			},
			borderRadius: {
				lg: '12px', // Consistent 12px radius
				md: '8px',
				sm: '4px'
			},
			// Enhanced shadow system for depth
			boxShadow: {
				'card': '0 4px 16px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
				'button': '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 4px rgba(0, 0, 0, 0.1)',
				'button-hover': '0 8px 24px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15)',
				'input': 'inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05)',
				'input-focus': 'inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(255, 215, 0, 0.1)',
				'elevated': '0 12px 32px rgba(0, 0, 0, 0.18), 0 6px 16px rgba(0, 0, 0, 0.12)',
			},
			dropShadow: {
				'card': '0 4px 16px rgba(0, 0, 0, 0.12)',
				'button': '0 2px 8px rgba(0, 0, 0, 0.15)',
				'glow': '0 0 20px rgba(255, 215, 0, 0.3)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
        },
        'shine': {
          'from': { backgroundPosition: '200% 0' },
          'to': { backgroundPosition: '-200% 0' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 15px rgba(255, 215, 0, 0.2)' 
          },
          '50%': { 
            boxShadow: '0 0 25px rgba(255, 215, 0, 0.4)' 
          }
        }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'shine': 'shine 5s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
