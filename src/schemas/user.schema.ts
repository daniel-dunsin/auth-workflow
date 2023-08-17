import { object, string, number, ObjectSchema } from "yup";

export const CreateUserSchema = object({
  body: object({
    email: string()
      .required("Email is required")
      .email("Must be a valid email"),
    password: string()
      .required("Password is required")
      .min(8, "Minimum of 8 characters is required for the password field"),
    confirm_password: string()
      .required("Confirm Password is required")
      .min(8, "Minimum of 8 characters is required for the password field"),
    firstname: string()
      .required("First name is required")
      .min(5, "Firstname must not be less than 5 characters"),
    lastname: string()
      .required("Lastname is required")
      .min(6, "Lastname must not be less than 6 charcacters"),
    phone_number: number().required("Provide phone number"),
    username: string()
      .required("Username is required")
      .min(6, "Username must not be less than 6 characters"),
  }),
});

export const VerifyUserInput = object({
  params: object({
    token: string().required("Token is required"),
    id: string().required("Id is required "),
  }),
});

export const RequestPasswordCodeInput = object({
  body: object({
    email: string().required("Email is required").email("Enter a valid email"),
  }),
});

export const ResetPasswordInput = object({
  params: object({
    token: string().required("Token is required"),
  }),
  body: object({
    password: string()
      .required("Provide password")
      .min(8, "Minimum of 8 characters is required for the password field"),
    confirm_password: string()
      .required("Provide confirm password field")
      .min(8, "Minimum of 8 characters is required for the password field"),
  }),
});
