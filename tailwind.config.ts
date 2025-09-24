import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        "13": "repeat(13, minmax(0, 1fr))",
      },
      colors: {
        primary: {
          "50": "#f8fafc",
          "100": "#f1f5f9",
          "200": "#e2e8f0",
          "300": "#cbd5e1",
          "400": "#94a3b8",
          "500": "#64748b",
          "600": "#475569",
          "700": "#334155",
          "800": "#1e293b",
          "900": "#0f172a",
          "950": "#020617",
        },
        // Pantone Red 032 C
        // RAL 3026
        // C00 M86 Y63 K00
        // R245 G51 B63
        // #f5333f
        red: {
          "50": "#ffe5e7",
          "100": "#ffc2c7",
          "200": "#ff8a97",
          "300": "#ff5a6d",
          "400": "#ff2a43",
          "500": "#f5333f", // Pantone Red 032 C
          "600": "#d11d2b",
          "700": "#a3151f",
          "800": "#7a1017",
          "900": "#510a0e",
          "950": "#2b0406",
        },
        // Pantone 282 C
        // RAL 5026
        // C100 M87 Y42 K52
        // R1 G30 B65
        // #011e41
        darkblue: {
          "50": "#e3e7ee",
          "100": "#b8c3d6",
          "200": "#7a8cb2",
          "300": "#4a5e86",
          "400": "#23355a",
          "500": "#011e41", // Pantone 282 C
          "600": "#011a39",
          "700": "#01142e",
          "800": "#010f22",
          "900": "#000a15",
          "950": "#00040a",
        },
        // Pantone Black 7CP
        // C00 M00 Y00 K95
        // R50 G50 B50
        // #323232
        // Pantone Black 7CP
        // C00 M00 Y00 K95
        // R50 G50 B50
        // #323232
        darkgray: {
          "50": "#ededed",
          "100": "#d6d6d6",
          "200": "#b0b0b0",
          "300": "#8a8a8a",
          "400": "#646464",
          "500": "#323232", // Pantone Black 7CP
          "600": "#292929",
          "700": "#202020",
          "800": "#171717",
          "900": "#0e0e0e",
          "950": "#070707",
        },
        // Pantone Cool Gray 1C
        // C00 M00 Y00 K10
        // R237 G237 B237
        // #ededed
        coolgray: {
          "50": "#f8f8f8",
          "100": "#ededed", // Pantone Cool Gray 1C
          "200": "#d6d6d6",
          "300": "#b0b0b0",
          "400": "#8a8a8a",
          "500": "#646464",
          "600": "#3e3e3e",
          "700": "#232323",
          "800": "#171717",
          "900": "#0e0e0e",
          "950": "#070707",
        },
      },
    },
    fontFamily: {
      body: [
        "Montserrat",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "system-ui",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
      sans: [
        "Montserrat",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "system-ui",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
    },
    keyframes: {
      shimmer: {
        "100%": {
          transform: "translateX(100%)",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;
