import { z } from "zod";

export const updateUserSchema = z.object({
	id: z.string(),
	firstName: z
		.string()
		.min(1, "You must specify a first name.")
		.or(z.literal(""))
		.optional(),
	lastName: z.string().optional(),
	email: z
		.string()
		.email("A valid email is required.")
		.or(z.literal(""))
		.optional(),
	username: z
		.string()
		.min(3, "Username must be at least 3 characters.")
		.max(32, "A shorter username is required.")
		.or(z.literal(""))
		.optional(),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters.")
		.max(64, "A shorter password is required.")
		.or(z.literal(""))
		.optional(),
	confirmPassword: z.string().or(z.literal("")).optional()
});

export const createUserSchema = z
	.object({
		firstName: z.string().min(1, "You must specify a first name."),
		lastName: z.string().optional(),
		email: z.string().email("A valid email is required."),
		username: z
			.string()
			.min(3, "Username must be at least 3 characters.")
			.max(32, "A shorter username is required."),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters.")
			.max(64, "A shorter password is required."),
		confirmPassword: z.string()
	})
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				path: ["confirmPassword"],
				code: "custom",
				message: "Passwords don't match!"
			});
		}
	});
