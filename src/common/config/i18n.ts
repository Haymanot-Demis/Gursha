import { query } from "express";
import i18n from "i18n";
import path from "path";

i18n.configure({
	locales: ["en", "am"],
	directory: path.join(__dirname, "./../locales"),
	defaultLocale: "en",
	queryParameter: "lang",
});

export default i18n;
