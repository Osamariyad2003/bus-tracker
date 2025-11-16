/**
 * Environment variables validation
 * Validates required environment variables and provides helpful error messages
 */

interface EnvConfig {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  VITE_GOOGLE_MAPS_API_KEY: string;
}

function validateEnv(): EnvConfig {
  const errors: string[] = [];

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!supabaseUrl) {
    errors.push("VITE_SUPABASE_URL is required");
  }

  if (!supabaseAnonKey) {
    errors.push("VITE_SUPABASE_ANON_KEY is required");
  }

  if (!googleMapsApiKey) {
    errors.push(
      "VITE_GOOGLE_MAPS_API_KEY is required for map functionality"
    );
  }

  if (errors.length > 0) {
    const errorMessage = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  Missing Environment Variables
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The following environment variables are missing:

${errors.map((err) => `  • ${err}`).join("\n")}

Please create a .env file in the project root with the
required variables. See .env.example for a template.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    console.error(errorMessage);
    throw new Error("Missing required environment variables");
  }

  return {
    VITE_SUPABASE_URL: supabaseUrl,
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey,
    VITE_GOOGLE_MAPS_API_KEY: googleMapsApiKey,
  };
}

// Validate on module load (only in browser)
let env: EnvConfig;

try {
  env = validateEnv();
} catch (error) {
  // Show a user-friendly error page instead of crashing
  if (typeof window !== "undefined") {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorsList = [
      "VITE_SUPABASE_URL",
      "VITE_SUPABASE_ANON_KEY",
      "VITE_GOOGLE_MAPS_API_KEY",
    ].filter((key) => !import.meta.env[key]);

    document.body.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: system-ui, -apple-system, sans-serif;">
        <div style="background: white; border-radius: 12px; padding: 3rem; max-width: 600px; margin: 2rem; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
          <div style="text-align: center; margin-bottom: 2rem;">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h1 style="font-size: 1.5rem; font-weight: bold; color: #1f2937; margin-bottom: 1rem;">Configuration Required</h1>
          <p style="color: #6b7280; margin-bottom: 1.5rem;">This application requires environment variables to be configured. Please set up your <code style="background: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 4px; font-family: monospace;">.env</code> file.</p>
          <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 1rem; margin-bottom: 1.5rem;">
            <p style="font-weight: 600; color: #991b1b; margin-bottom: 0.5rem;">Missing Variables:</p>
            <ul style="color: #7f1d1d; font-size: 0.875rem; margin: 0; padding-left: 1.5rem;">
              ${errorsList.map((err) => `<li>${err}</li>`).join("")}
            </ul>
          </div>
          <p style="color: #6b7280; font-size: 0.875rem;">Create a <code style="background: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 4px; font-family: monospace;">.env</code> file in the project root with these variables.</p>
        </div>
      </div>
    `;
  }
  throw error;
}

export { env };
export type { EnvConfig };

