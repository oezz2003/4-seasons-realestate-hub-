import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
        headline: ['"Manrope"', 'sans-serif'],
        display: ['"Manrope"', 'sans-serif'],
        label: ['"Plus Jakarta Sans"', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: '#006383',
          foreground: '#e6f5ff',
          container: '#7bcbf3',
          dim: '#005673',
          fixed: '#7bcbf3',
        },
        secondary: {
          DEFAULT: '#a33700',
          foreground: '#ffefeb',
          container: '#ffc4b0',
          dim: '#8f2f00',
        },
        tertiary: {
          DEFAULT: '#3c6600',
          foreground: '#d9ffab',
          container: '#c1fd7c',
          dim: '#345900',
        },
        surface: {
          DEFAULT: '#f6f6f9',
          dim: '#d2d4d8',
          bright: '#f6f6f9',
          low: '#f0f0f3',
          lowest: '#ffffff',
          container: {
            DEFAULT: '#e7e8eb',
            low: '#f0f0f3',
            high: '#e1e2e6',
            highest: '#dbdde0',
          }
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-down': {
            '0%': {
                opacity: '0',
                transform: 'translateY(-20px)'
            },
            '100%': {
                opacity: '1',
                transform: 'translateY(0)'
            },
        },
        'fade-in-up': {
            '0%': {
                opacity: '0',
                transform: 'translateY(20px)'
            },
            '100%': {
                opacity: '1',
                transform: 'translateY(0)'
            },
        },
        'title-reveal': {
          '0%': {
            transform: 'translateY(100%)',
          },
          '100%': {
            transform: 'translateY(0)',
          }
        },
        'preloader-slide-in': {
          'from': { transform: 'translateY(-100%)' },
          'to': { transform: 'translateY(0)' },
        },
        'preloader-slide-out-up': {
          'from': { transform: 'translateY(0)' },
          'to': { transform: 'translateY(-100%)' },
        },
        'preloader-slide-out-down': {
          'from': { transform: 'translateY(0)' },
          'to': { transform: 'translateY(100%)' },
        },
        'logo-fade-in': {
            '0%': { opacity: '0', transform: 'scale(0.8)' },
            '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'logo-fade-out': {
            '0%': { opacity: '1', transform: 'scale(0.8)' },
            '100%': { opacity: '0', transform: 'scale(0.8)' },
        },
        marqueeLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeRight: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-in-out',
        'fade-in-down': 'fade-in-down 0.6s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'title-reveal': 'title-reveal 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'preloader-slide-in': 'preloader-slide-in 0.8s cubic-bezier(0.87, 0, 0.13, 1) forwards',
        'preloader-slide-out-up': 'preloader-slide-out-up 0.9s cubic-bezier(0.87, 0, 0.13, 1) forwards',
        'preloader-slide-out-down': 'preloader-slide-out-down 0.9s cubic-bezier(0.87, 0, 0.13, 1) forwards',
        'logo-fade-in': 'logo-fade-in 0.6s 0.7s ease-out forwards',
        'logo-fade-out': 'logo-fade-out 0.5s ease-in forwards',
        'marqueeLeft': 'marqueeLeft 60s linear infinite',
        'marqueeRight': 'marqueeRight 60s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
