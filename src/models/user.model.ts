import mongoose from "mongoose";
import { UserRole, UserRoles } from "../types";
import { compareValue, hashValue } from "../utils/bcrypt";

export interface UserDocument extends mongoose.Document {
  fullname: string;
  email: string;
  phone: string;
  role: UserRole;
  password: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(val: string): Promise<Boolean>;
  omitPassword(): Omit<UserDocument, "password" | keyof mongoose.Document>;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Email is invalid"], // Regex for email validation
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^\+?[1-9]\d{1,14}$/, "Phone number is invalid"], // Allow optional + sign at the start
    },
    role: {
      type: String,
      enum: UserRoles,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Middleware to hash password before saving the document
userSchema.pre("save", async function (next) {
  const user = this as UserDocument;

  if (!user.isModified("password")) {
    return next();
  }

  user.password = await hashValue(user.password); // Use the hashValue function
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as UserDocument;
  return compareValue(candidatePassword, user.password);
};

// Method to omit the password field when returning user data
userSchema.methods.omitPassword = function (): Omit<UserDocument, "password" | keyof mongoose.Document> {
  const user = this.toObject();
  delete user.password; // Remove the password property
  return user;
};

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
