import { Role } from "../config/constants";

export const strongPasswordErrorMessage = {
	"string.pattern.base":
		"Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
};

export const phoneNumberRegExErrorMessage = {
	"string.pattern.base": "Phone number must be in the format +2519XXXXXXXX",
};

export const joiErrorMessages = {
	firstName: {
		en: {
			"any.required": "First Name is required",
			"string.min": `First Name must be at least 3 characters long`,
			"string.max": `First Name must be no more than 30 characters long`,
		},
		am: {
			"any.required": "የመጀመሪያ ስም ያስፈልጋል",
			"string.min": `የመጀመሪያ ስም ቢያንስ 3 ፊደላት ርዝመት መሆን አለበት።`,
			"string.max": `የመጀመሪያ ስም ከ 30 ፊደላት ርዝመት በላይ መሆን የለበትም።`,
		},
	},
	lastName: {
		en: {
			"any.required": "Last Name is required",
			"string.min": `Last Name must be at least 3 characters long`,
			"string.max": `Last Name must be no more than 30 characters long`,
		},
		am: {
			"any.required": "የመጀመሪያ ስም ያስፈልጋል",
			"string.min": `የመጀመሪያ ስም ቢያንስ 3 ፊደላት ርዝመት መሆን አለበት።`,
			"string.max": `የመጀመሪያ ስም ከ 30 ፊደላት ርዝመት በላይ መሆን የለበትም።`,
		},
	},
	email: {
		en: {
			"string.email": `Email must be a valid email address`,
			"any.required": `Email is required`,
			"object.missing": "Either email or phone number is required.",
		},
		am: {
			"string.email": `ያስገቡት ኢሜይል ትክክለኛ የኢሜይል አድራሻ አይደለም።`,
			"any.required": `ኢሜል ያስፈልጋል`,
			"object.missing": "ኢሜል ወይም ስልክ ቁጥር ያስፈልጋል።",
		},
	},
	password: {
		en: {
			"any.required": `Password is required`,
			"string.min": `Password must be at least 6 characters long`,
			"string.max": `Password must be no more than 30 characters long`,
			"string.pattern.base":
				"Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
		},
		am: {
			"any.required": `የይለፍ ቃል ያስፈልጋል`,
			"string.min": `የይለፍ ቃል ቢያንስ የ 6 ፊደላት ርዝመት መሆን አለበት።`,
			"string.max": `የይለፍ ቃል ከ 30 ፊደላት ርዝመት በላይ መሆን የለበትም።`,
			"string.pattern.base":
				"የይለፍ ቃል ቢያንስ አንድ አቢይ ሆሄ፣ አንድ ትንሽ ሆሄ፣ አንድ ቁጥር እና አንድ ልዩ ፊደል መያዝ አለበት።",
		},
	},
	phoneNumber: {
		en: {
			"string.pattern.base": `Phone Number must be in the format +2519XXXXXXXX`,
		},
		am: {
			"string.pattern.base": `ስልክ ቁጥር በ +2519XXXXXXXX መልክ መሆን አለበት`,
		},
	},
	role: {
		en: {
			"any.required": `Role is required`,
			"string.valid": `Role must be either ${Role.CLIENT} or ${Role.MERCHANT}`,
		},
		am: {
			"any.required": `ሚና ያስፈልጋል`,
			"string.valid": `ሚና ${Role.CLIENT} ወይም ${Role.MERCHANT} መሆን አለበት`,
		},
	},
	token: {
		en: {
			"any.required": `Token is required`,
			"string.length": `Token must be 6 characters long`,
		},
		am: {
			"any.required": `ቶክን ያስፈልጋል`,
			"string.length": `ቶክን 6 ፊደላት ርዝመት መሆን አለበት`,
		},
	},
	oldPassword: {
		en: {
			"any.required": `Old Password is required`,
			"string.min": `Old Password must be at least 6 characters long`,
			"string.max": `Old Password must be no more than 30 characters long`,
		},
		am: {
			"any.required": `የድሮ የይለፍ ቃል ያስፈልጋል`,
			"string.min": `የድሮ የይለፍ ቃል ያስፈልጋል ቢያንስ የ 6 ፊደላት ርዝመት መሆን አለበት።`,
			"string.max": `የድሮ የይለፍ ቃል ያስፈልጋል ከ 30 ፊደላት ርዝመት በላይ መሆን የለበትም።`,
		},
	},
	newPassword: {
		en: {
			"any.required": `newPassword is required`,
			"string.min": `newPassword must be at least 3 characters long`,
			"string.max": `newPassword must be no more than 30 characters long`,
			"string.pattern.base":
				"Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
		},
		am: {
			"any.required": `አዲስ የይለፍ ቃል ያስፈልጋል`,
			"string.min": `አዲስ የይለፍ ቃል ቢያንስ 3 ፊደላት ርዝመት መሆን አለበት።`,
			"string.max": `አዲስ የይለፍ ቃል ከ 30 ፊደላት ርዝመት በላይ መሆን የለበትም።`,
			"string.pattern.base":
				"አዲስ የይለፍ ቃል ቢያንስ አንድ አቢይ ሆሄ፣ አንድ ትንሽ ሆሄ፣ አንድ ቁጥር እና አንድ ልዩ ፊደል መያዝ አለበት።",
		},
	},
	refreshToken: {
		en: { "any.required": `Refresh Token is required` },
		am: { "any.required": `ማደሻ ቶክን ያስፈልጋል` },
	},
};
