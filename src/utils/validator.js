
export const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isPasswordStrong = (password) => {
    return password.length >= 8 && /\d/.test(password) && /[A-Z]/.test(password);
};
