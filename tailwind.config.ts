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
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Raleway', 'system-ui', 'sans-serif'],
				'raleway-dots': ['Raleway Dots', 'cursive'],
				'doto': ['Doto', 'monospace'],
			},
			colors: {
				// Core System
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				
				// Surface Colors
				surface: {
					DEFAULT: 'hsl(var(--surface))',
					hover: 'hsl(var(--surface-hover))',
					active: 'hsl(var(--surface-active))',
				},
				
				// Interactive Elements
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					hover: 'hsl(var(--primary-hover))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					hover: 'hsl(var(--secondary-hover))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
					hover: 'hsl(var(--accent-hover))',
				},
				
				// Status Colors
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				
				// Text Hierarchy
				text: {
					primary: 'hsl(var(--text-primary))',
					secondary: 'hsl(var(--text-secondary))',
					muted: 'hsl(var(--text-muted))',
					disabled: 'hsl(var(--text-disabled))',
				},
				
				// Form & Input
				'input-border': 'hsl(var(--input-border))',
				'input-focus': 'hsl(var(--input-focus))',
				
				// Card & Surfaces
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
					hover: 'hsl(var(--card-hover))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				
				// Sidebar System
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))',
					hover: 'hsl(var(--sidebar-hover))',
					active: 'hsl(var(--sidebar-active))',
				},
				
				// Credit System
				credits: {
					bg: 'hsl(var(--credits-bg))',
					border: 'hsl(var(--credits-border))',
					glow: 'hsl(var(--credits-glow))',
				},
				
				// Modal System - Login/Signup
				modal: {
					DEFAULT: 'hsl(var(--modal-background))',
					foreground: 'hsl(var(--modal-foreground))',
				}
			},
			backgroundImage: {
				'brand-gradient': 'var(--brand-gradient)',
			},
			boxShadow: {
				'sm': 'var(--shadow-sm)',
				'md': 'var(--shadow-md)',
				'lg': 'var(--shadow-lg)',
				'xl': 'var(--shadow-xl)',
			},
			transitionProperty: {
				'fast': 'var(--transition-fast)',
				'normal': 'var(--transition-normal)',
				'slow': 'var(--transition-slow)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				xl: 'var(--radius-xl)',
			},
				keyframes: {
					'shine': {
						'0%': { 'background-position': '100%' },
						'100%': { 'background-position': '-100%' },
					},
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
				'fade-in': {
					from: { opacity: '0', transform: 'translateY(4px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'scale-in': {
					from: { opacity: '0', transform: 'scale(0.95)' },
					to: { opacity: '1', transform: 'scale(1)' }
				},
				'slide-in-left': {
					from: { opacity: '0', transform: 'translateX(-12px)' },
					to: { opacity: '1', transform: 'translateX(0)' }
				},
				'slide-in-right': {
					from: { opacity: '0', transform: 'translateX(12px)' },
					to: { opacity: '1', transform: 'translateX(0)' }
				},
				'glow-pulse': {
					'0%, 100%': { boxShadow: '0 0 20px hsl(var(--credits-glow))' },
					'50%': { boxShadow: '0 0 30px hsl(var(--credits-glow)), 0 0 40px hsl(var(--credits-glow))' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				},
				'typewriter': {
					from: { width: '0' },
					to: { width: '100%' }
				},
				'ripple': {
					'0%': { transform: 'scale(0.8)', opacity: '1' },
					'100%': { transform: 'scale(2)', opacity: '0' }
				},
				'glow-ring': {
					'0%, 100%': { 
						boxShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor'
					},
					'50%': { 
						boxShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor'
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'pulse-glow': {
					'0%, 100%': { opacity: '0.6', filter: 'brightness(1)' },
					'50%': { opacity: '1', filter: 'brightness(1.2)' }
				}
			},
				animation: {
					'shine': 'shine 5s linear infinite',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'slide-in-left': 'slide-in-left 0.4s ease-out',
				'slide-in-right': 'slide-in-right 0.4s ease-out',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'shimmer': 'shimmer 2s linear infinite',
				'typewriter': 'typewriter 1.5s steps(40, end)',
				'ripple': 'ripple 0.6s ease-out',
				'glow-ring': 'glow-ring 2s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
