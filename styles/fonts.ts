import { nextImageLoaderRegex } from "next/dist/build/webpack-config";
import {
	Bricolage_Grotesque,
	Fira_Code,
	MedievalSharp,
	Montserrat,
	Noto_Sans_Display,
	Noto_Serif,
	Open_Sans,
	Playfair_Display,
	Rubik,
	Source_Sans_3,
	Inter,
	Space_Grotesk,
	Syne,
	Krona_One,
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
export const noto_sans_display = Noto_Sans_Display({
	subsets: ["latin"],
	variable: "--font-noto-sans-display",
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
export const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	// display: 'swap',
});
export const space_grotesk = Space_Grotesk({
	subsets: ["latin"],
	variable: "--font-space-grotesk",
	// display: 'swap',
});
export const syne = Syne({
	subsets: ["latin"],
	variable: "--font-syne",
	// display: 'swap',
});

// Not variable
export const krona_one = Krona_One({
	subsets: ["latin"],
	variable: "--font-syne",
	weight: "400",
	// display: 'swap',
});
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
// export const chillax = localFont({
// 	src: "../public/assets/fonts/Chillax/Chillax-Variable.woff2",
// 	variable: "--font-chillax",
// 	// display: 'swap',
// });
// export const general_sans = localFont({
// 	src: "../public/assets/fonts/GeneralSans/GeneralSans-Variable.woff2",
// 	variable: "--font-general-sans",
// 	// display: 'swap',
// });
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
	"--font-fira-code": fira_code.style.fontFamily,
	"--font-medieval-sharp": medieval_sharp.style.fontFamily,
	"--font-merriweather": merriweather.style.fontFamily,
	"--font-montserrat": montserrat.style.fontFamily,
	"--font-noto-sans-display": noto_sans_display.style.fontFamily,
	"--font-noto-serif": noto_serif.style.fontFamily,
	"--font-open-sans": open_sans.style.fontFamily,
	"--font-playfair-display": playfair_display.style.fontFamily,
	"--font-rubik": rubik.style.fontFamily,
	"--font-source-sans-3": source_sans_3.style.fontFamily,
	"--font-zodiak": zodiak.style.fontFamily,
	"--font-inter": inter.style.fontFamily,
	"--font-space-grotesk": space_grotesk.style.fontFamily,
	"--font-syne": syne.style.fontFamily,
};
export default availableFontFamilies;
