import { Response } from "express";

export const errorMessages = (res: Response) => {
	return {
		userNotFound: res.__("userNotFound"),
		invalidCredentials: res.__("invalidCredentials"),
		emailAlreadyExists: res.__("emailAlreadyExists"),
		phoneNumberAlreadyExists: res.__("phoneNumberAlreadyExists"),
		emailNotVerified: res.__("emailNotVerified"),
		phoneNotVerified: res.__("phoneNotVerified"),
		accountLocked: res.__("accountLocked"),
		invalidJWTToken: res.__("invalidJWTToken"),
		emailAlreadyVerified: res.__("emailAlreadyVerified"),
		phoneAlreadyVerified: res.__("phoneAlreadyVerified"),
		tokenNotFound: res.__("tokenNotFound"),
		emailVerificationTokenExpired: res.__("emailVerificationTokenExpired"),
		phoneVerificationTokenExpired: res.__("phoneVerificationTokenExpired"),
		passwordResetTokenExpired: res.__("passwordResetTokenExpired"),
		tooManyRequests: res.__("tooManyRequests"),
		unuthenticated: res.__("unuthenticated"),
		unauthorized: res.__("unauthorized"),
		internalServerError: res.__("internalServerError"),
		businessNotFound: "Business not found",
		branchNotFound: "Branch not found",
		branchManagerNotFound: "Branch Manager not found",
		categoryNotFound: "Category not found",
		productNotFound: "Product not found",
		branchProductNotFound: "Branch Product not found",
		branchProductExists: "Branch Product already exists",
		productExist: "Product with the same name already exists",
	};
};

export const successMessages = (res: Response) => {
	return {
		registrationWithEmailSuccessful: res.__("registrationWithEmailSuccessful"),
		registrationWithPhoneSuccessful: res.__("registrationWithPhoneSuccessful"),
		verificationSuccessful: res.__("verificationSuccessful"),
		loginSuccessful: res.__("loginSuccessful"),
		passwordResetTokenSentToEmail: res.__("passwordResetTokenSentToEmail"),
		passwordResetTokenSentToPhone: res.__("passwordResetTokenSentToPhone"),
		passwordResetSuccessful: res.__("passwordResetSuccessful"),
		passwordChangedSuccessfully: res.__("passwordChangedSuccessfully"),
		updateProfileSuccessful: res.__("updateProfileSuccessful"),
		refreshTokenCreated: res.__("refreshTokenCreated"),
	};
};

const amharicErrorMessages = {
	userNotFound: "ተጠቃሚው አልተገኘም።",
	invalidCredentials: "የተሳሳት ምስክርነት",
	emailAlreadyExists: "ይህ ኢሜይል አድራሻ ያለው መለያ አስቀድሞ አለ።",
	phoneNumberAlreadyExists: "ይህ ስልክ ቁጥር ያለው መለያ አስቀድሞ አለ።",
	emailNotVerified: "የኢሜይል አድራሻዎ አልተረጋገጠም። የማረጋገጫ ኮድ ለማግኘት እባክዎ ኢሜልዎን ይመልከቱ",
	phoneNotVerified:
		"ስልክ ቁጥርዎ አልተረጋገጠም። እባኮት ስልክ ቁጥርዎን ለማረጋገጥ እባኮት የስልኩን አጭር የጽሁፍ ሳጥን ይመልከቱ።",
	accountLocked: "በብዙ ያልተሳኩ የመግባት ሙከራዎች ምክንያት መለያህ ተቆልፏል።",
	invalidJWTToken: "የቀረበው ቶክን ልክ ያልሆነ ነው።",
	emailAlreadyVerified: "የኢሜል አድራሻዎ አስቀድሞ ተረጋግጧል።",
	phoneAlreadyVerified: "ስልክ ቁጥርዎ አስቀድሞ ተረጋግጧል።",
	tokenNotFound: "ያስገቡት ኮድ ሊገኝ አልቻለም።",
	emailVerificationTokenExpired:
		"የኢሜል ማረጋገጫ አጭር ኮድ ጊዜው አልፎበታል። እባክዎ ለአዲስ ማስመሰያ ኢሜልዎን ያረጋግጡ።",
	phoneVerificationTokenExpired:
		"የስልክ ቁጥር ማረጋገጫ አጭር ኮድ ጊዜው አልፎበታል። እባክዎ ለአዲስ ኮድ የስልክዎን አጭር ጽሁፍ መልዕክቶችዎን ይመልከቱ",
	passwordResetTokenExpired: "የይለፍ ቃል ዳግም ማስጀመር አጭር የጽሁፍ ኮድ ጊዜው አልፎበታል።",
	tooManyRequests:
		"በአጭር ጊዜ ውስጥ በጣም ብዙ ጥያቄዎችን አቅርበዋል። እባክዎን ትንሽ ይጠብቁ እና እንደገና ይሞክሩ።",
	internalServerError: "ያልተጠበቀ ስህተት ተከስቷል። እባክዎ ቆይተው እንደገና ይሞክሩ።",
	unauthorized: "ይህን ግብዓት ለመድረስ ፍቃድ የለዎትም።",
	unuthenticated: "ያልተረጋገጠ",
};

const amharicSuccessMessages = {
	registrationWithEmailSuccessful:
		"ምዝገባው ተሳክቷል። የማረጋገጫ ኮድ ለማግኘት እባክዎ ኢሜልዎን ያረጋግጡ።",
	registrationWithPhoneSuccessful:
		"ምዝገባው ተሳክቷል። የማረጋገጫ ኮድ ወደ ተንቀሳቃሽ ስልክ ቁጥርዎ ተልኳል።",
	verificationSuccessful: "አካውንትዎ ተሳካ ሁኔታ ተረጋግጧል።",
	loginSuccessful: "መግባቱ በተሳካ ሁኔታ ተጠናቅቋል።",
	passwordResetTokenSentToEmail:
		"የይለፍ ቃል ዳግም ማስጀመር አጭር ኮድ በተሳካ ሁኔታ ወደ ኢሜልዎ ተልኳል።",
	passwordResetTokenSentToPhone:
		"የይለፍ ቃል ዳግም ማስጀመር አጭር ኮድ በተሳካ ሁኔታ ወደ ተንቀሳቃሽ ስልክ ቁጥርዎ ተልኳል።",
	passwordResetSuccessful: "የይለፍ ቃል ዳግም ማስጀመር በተሳካ ሁኔታ ተጠናቅቋል።",
	passwordChangedSuccessfully: "የይለፍ ቃል በተሳካ ሁኔታ ተቀይሯል።",
	updateProfileSuccessful: "መገለጫ በተሳካ ሁኔታ ተዘምኗል።",
	refreshTokenCreated: "የማደስ ማስመሰያ በተሳካ ሁኔታ ተፈጥሯል።",
};
