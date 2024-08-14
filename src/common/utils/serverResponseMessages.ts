export const errorMessages = {
	userNotFound: "User not found",
	invalidCredentials: "Invalid credentials",
	emailAlreadyExists: "Email already exists",
	phoneNumberAlreadyExists: "Phone number already exists",
	emailNotVerified: "Email is not verified, please check your email",
	phoneNotVerified:
		"PhoneNumber is not verified, please check your SMS on your mobile number for OTP",
	accountLocked: "Account locked, due to multiple failed login attempts",
	invalidRefreshToken: "Invalid refresh token",
	emailAlreadyVerified: "Email already verified",
	phoneAlreadyVerified: "Phone number already verified",
	tokenNotFound: "Token not found",
	emailVerificationTokenExpired:
		"Email verification token expired, check your email for new token",
	phoneVerificationTokenExpired:
		"Phone number verification OPT expired, check your SMS for new one",
	passwordResetTokenExpired: "Password reset token expired",
	tooManyRequests: "Too many requests, please try again after 1 minute",
};

export const successMessages = {
	registrationWithEmailSuccessful:
		"Registration successful, check your email for verification token",
	registrationWithPhoneSuccessful:
		"Registration successful, we sent you a verification token to your mobile number",
	verificationSuccessful: "Verification successful",
	loginSuccessful: "Login successful",
	passwordResetTokenSentToEmail:
		"Password reset OTP sent successfully to your email",
	passwordResetTokenSentToPhone:
		"Password reset OTP sent successfully to your mobile number",
	passwordResetSuccessful: "Password reset successful",
	passwordChangedSuccessfully: "Password changed successfully",
	updateProfileSuccessful: "Profile updated successfully",
	refreshTokenCreated: "Refresh token created",
};
