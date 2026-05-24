import { User } from "./user.types";

/**
 * Severity level of logged operational exceptions.
 */
export type ErrorSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | "FATAL";

/**
 * System error category classification.
 */
export type ErrorType =
  | "SERVER_ERROR"
  | "DATABASE_ERROR"
  | "RATE_LIMIT_ERROR"
  | "THIRD_PARTY_ERROR"
  | "OTHER";

/**
 * Core ErrorLog schema representation for frontend diagnostic dashboard.
 */
export interface ErrorLog {
  id: string;
  correlationId: string | null;
  errorCode: string | null;
  errorMessage: string;
  stackTrace: string | null;
  fileName: string | null;
  functionName: string | null;
  severity: ErrorSeverity;
  errorType: ErrorType;
  requestUrl: string | null;
  requestMethod: string | null;
  ipAddress: string | null;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  User?: User | null;
}
