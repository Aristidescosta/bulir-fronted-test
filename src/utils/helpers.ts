import { toast } from "sonner";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function showApiErrors(errors: Record<string, any>) {
    Object.values(errors).forEach((section) => {
        if (typeof section === 'object') {
            Object.values(section).forEach((message) => {
                if (typeof message === 'string') toast.error(message);
            });
        }
    });
}
