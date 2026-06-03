'use server';

import { createClient } from '@supabase/supabase-js';

// Initialize a privileged administrative engine using environment variables
// Ensure SUPABASE_SERVICE_ROLE_KEY is saved in your local .env.local file
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '', // 🔒 Secure server-only bypass credential key
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

interface AdminResetResponse {
  success: boolean;
  message: string;
}

export async function adminResetUserPassword(userId: string, newPasswordString: string): Promise<AdminResetResponse> {
  try {
    if (!userId || !newPasswordString) {
      return { success: false, message: "Missing tracking target metadata keys." };
    }

    console.log(`📡 [SERVER-ACTION] Initiating password override for payload node: ${userId}`);

    // Execute privileged user update bypass route securely
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { password: newPasswordString }
    );

    if (error) throw error;

    return { 
      success: true, 
      message: "Target credentials modified across secure schema records." 
    };
  } catch (err: any) {
    console.error("❌ [SERVER-ACTION CRASH] Privileged reset transaction rejected:", err);
    return { 
      success: false, 
      message: err?.message || "Internal administrative infrastructure error encountered." 
    };
  }
}