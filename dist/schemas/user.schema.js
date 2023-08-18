"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenInput = exports.LoginInput = exports.ResetPasswordInput = exports.RequestPasswordCodeInput = exports.VerifyUserInput = exports.CreateUserSchema = void 0;
const yup_1 = require("yup");
exports.CreateUserSchema = (0, yup_1.object)({
    body: (0, yup_1.object)({
        email: (0, yup_1.string)()
            .required("Email is required")
            .email("Must be a valid email"),
        password: (0, yup_1.string)()
            .required("Password is required")
            .min(8, "Minimum of 8 characters is required for the password field"),
        confirm_password: (0, yup_1.string)()
            .required("Confirm Password is required")
            .min(8, "Minimum of 8 characters is required for the password field"),
        firstname: (0, yup_1.string)()
            .required("First name is required")
            .min(5, "Firstname must not be less than 5 characters"),
        lastname: (0, yup_1.string)()
            .required("Lastname is required")
            .min(6, "Lastname must not be less than 6 charcacters"),
        phone_number: (0, yup_1.number)().required("Provide phone number"),
        username: (0, yup_1.string)()
            .required("Username is required")
            .min(6, "Username must not be less than 6 characters"),
    }),
});
exports.VerifyUserInput = (0, yup_1.object)({
    params: (0, yup_1.object)({
        token: (0, yup_1.string)().required("Token is required"),
        id: (0, yup_1.string)().required("Id is required "),
    }),
});
exports.RequestPasswordCodeInput = (0, yup_1.object)({
    body: (0, yup_1.object)({
        email: (0, yup_1.string)().required("Email is required").email("Enter a valid email"),
    }),
});
exports.ResetPasswordInput = (0, yup_1.object)({
    params: (0, yup_1.object)({
        token: (0, yup_1.string)().required("Token is required"),
    }),
    body: (0, yup_1.object)({
        password: (0, yup_1.string)()
            .required("Provide password")
            .min(8, "Minimum of 8 characters is required for the password field"),
        confirm_password: (0, yup_1.string)()
            .required("Provide confirm password field")
            .min(8, "Minimum of 8 characters is required for the password field"),
    }),
});
exports.LoginInput = (0, yup_1.object)({
    body: (0, yup_1.object)({
        email: (0, yup_1.string)().email(),
        password: (0, yup_1.string)()
            .required()
            .min(8, "Minimum of 8 characters is required for the password field"),
        username: (0, yup_1.string)(),
    }),
});
exports.RefreshTokenInput = (0, yup_1.object)({
    body: (0, yup_1.object)({
        refresh_token: (0, yup_1.string)().required(),
    }),
});
