import {
	Bricolage_Grotesque,
	Dancing_Script,
	Fira_Code,
	Josefin_Sans,
	MedievalSharp,
	Merriweather_Sans,
	Montserrat,
	Noto_Sans_Display,
	Noto_Serif,
	Open_Sans,
	Pixelify_Sans,
	Playfair_Display,
	Rubik,
	Source_Sans_3,
} from "next/font/google";
import localFont from "next/font/local";

// Google fonts
export const bricolage_grotesque = Bricolage_Grotesque({
	subsets: ["latin"],
	variable: "--font-bricolage-grotesque",
	// display: 'swap',
});
export const fira_code = Fira_Code({
	subsets: ["latin"],
	variable: "--font-fira-code",
	// display: 'swap',
});
export const open_sans = Open_Sans({
	subsets: ["latin"],
	variable: "--font-open-sans",
	// display: 'swap',
});
export const josefin_sans = Josefin_Sans({
	subsets: ["latin"],
	variable: "--font-josefin-sans",
	// display: 'swap',
});
export const noto_sans_display = Noto_Sans_Display({
	subsets: ["latin"],
	variable: "--font-noto-sans-display",
	// display: 'swap',
});
export const merriweather_sans = Merriweather_Sans({
	subsets: ["latin"],
	variable: "--font-merriweather-sans",
	// display: 'swap',
});
export const noto_serif = Noto_Serif({
	subsets: ["latin"],
	variable: "--font-noto-serif",
	// display: 'swap',
});
export const source_sans_3 = Source_Sans_3({
	subsets: ["latin"],
	variable: "--font-source-sans",
	// display: 'swap',
});
export const playfair_display = Playfair_Display({
	subsets: ["latin"],
	variable: "--font-playfair-display",
	// display: 'swap',
});
export const dancing_script = Dancing_Script({
	subsets: ["latin"],
	variable: "--font-dancing-script",
	// display: 'swap',
});
export const rubik = Rubik({
	subsets: ["latin"],
	variable: "--font-rubik",
	// display: 'swap',
});
export const montserrat = Montserrat({
	subsets: ["latin"],
	variable: "--font-monteserrat",
	// display: 'swap',
});
export const pixelify_sans = Pixelify_Sans({
	subsets: ["latin"],
	variable: "--font-pixelify-sans",
	// display: 'swap',
});
// Not variable
export const medieval_sharp = MedievalSharp({
	subsets: ["latin"],
	weight: "400",
	variable: "--font-medieval-sharp",
	// display: 'swap',
});

// Local fonts
export const cabinet_grotesk = localFont({
	src: "../public/assets/fonts/CabinetGrotesk/CabinetGrotesk-Variable.woff2",
	variable: "--font-cabinet-grotesk",
	// display: 'swap',
});
export const chillax = localFont({
	src: "../public/assets/fonts/Chillax/Chillax-Variable.woff2",
	variable: "--font-chillax",
	// display: 'swap',
});
export const general_sans = localFont({
	src: "../public/assets/fonts/GeneralSans/GeneralSans-Variable.woff2",
	variable: "--font-general-sans",
	// display: 'swap',
});
export const merriweather = localFont({
	src: "../public/assets/fonts/Merriweather/MerriweatherSans-Variable.woff2",
	variable: "--font-merriweather",
	// display: 'swap',
});
export const zodiak = localFont({
	src: "../public/assets/fonts/Zodiak/Zodiak-Variable.woff2",
	variable: "--font-zodiak",
	// display: 'swap',
});

// Export a list of all available font families
export const availableFontFamilies = {
	"--font-bricolage-grotesque": bricolage_grotesque.style.fontFamily,
	"--font-cabinet-grotesk": cabinet_grotesk.style.fontFamily,
	// "--font-chillax": chillax.style.fontFamily,
	// "--font-dancing-script": dancing_script.style.fontFamily,
	"--font-fira-code": fira_code.style.fontFamily,
	// "--font-general-sans": general_sans.style.fontFamily,
	// "--font-josefin-sans": josefin_sans.style.fontFamily,
	"--font-medieval-sharp": medieval_sharp.style.fontFamily,
	"--font-merriweather": merriweather.style.fontFamily,
	// "--font-merriweather-sans": merriweather_sans.style.fontFamily,
	"--font-montserrat": montserrat.style.fontFamily,
	"--font-noto-sans-display": noto_sans_display.style.fontFamily,
	"--font-noto-serif": noto_serif.style.fontFamily,
	"--font-open-sans": open_sans.style.fontFamily,
	// "--font-pixelify-sans": pixelify_sans.style.fontFamily,
	"--font-playfair-display": playfair_display.style.fontFamily,
	"--font-rubik": rubik.style.fontFamily,
	"--font-source-sans-3": source_sans_3.style.fontFamily,
	"--font-zodiak": zodiak.style.fontFamily,
};
export default availableFontFamilies;
