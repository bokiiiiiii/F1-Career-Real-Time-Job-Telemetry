import { GoogleGenAI } from "@google/genai";
import { JobPosting } from "../types";
import { TeamConfig } from "../constants";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Fetches jobs for a SINGLE team using a Smart Crawler strategy.
 * It adapts the search query based on the target URL structure to maximize results.
 */
export const fetchTeamJobs = async (teamConfig: TeamConfig): Promise<JobPosting[]> => {
  const today = new Date().toISOString().split('T')[0];
  let hostname = "";
  try {
    hostname = new URL(teamConfig.url).hostname;
  } catch (e) {
    hostname = teamConfig.name;
  }

  // SMART QUERY STRATEGY
  // 1. If it's a dynamic job board subdomain (Workday, Greenhouse, Oracle), searching "site:" 
  //    is often too restrictive because Google indexes the main wrapper, not the dynamic content.
  //    So we search for the Team Name + keywords.
  // 2. For standard corporate sites (e.g. williamsf1.com), site:hostname is excellent for 
  //    drilling down into the specific domain.
  
  let query = "";
  if (hostname.includes('workday') || hostname.includes('greenhouse') || hostname.includes('gm.com') || hostname.includes('oracle')) {
      // Dynamic sites: Search broadly for the team's jobs + "vacancies" to catch aggregators or main pages
      query = `"${teamConfig.name}" jobs careers "current vacancies" list`;
  } else {
      // Static/Standard sites: Anchor to the domain to filter noise
      query = `site:${hostname} ("vacancies" OR "career opportunities" OR "open positions" OR "hiring")`;
  }

  const prompt = `
    You are a high-precision Job Crawler for Formula 1.
    TARGET TEAM: ${teamConfig.name}
    TARGET URL: ${teamConfig.url}
    
    TASK:
    1. Act as a crawler visiting the Target URL via Google Search results.
    2. **RECALL PRIORITY**: Your goal is to list AS MANY jobs as possible (target 10-20).
    3. **LIST SPLITTING**: If a search snippet says "Hiring: Aerodynamicist, Data Scientist, Mechanic", you MUST generate 3 separate job entries.
    4. **LINKING**:
       - If a direct link to a specific job post is visible, use it.
       - **CRITICAL**: If no direct deep-link is found, YOU MUST USE THE TARGET URL (${teamConfig.url}) as the 'applyUrl'. 
       - NEVER skip a job just because the URL is missing. The user wants to see the title.
    5. **DETAILS**:
       - Look for "Posted" dates (e.g. "2 days ago") -> Convert to YYYY-MM-DD.
       - Look for "Closing" dates (e.g. "Expires Oct 20", "Deadline: Nov 1") -> set 'dateClosing'.
       - If dates are missing, leave them null (do not filter the job out).
    
    OUTPUT:
    Return a JSON ARRAY of JobPosting objects.
    
    [
      {
        "id": "string",
        "title": "Job Title",
        "team": "${teamConfig.name}",
        "location": "City or 'HQ'",
        "department": "Engineering/Aero/Marketing/etc",
        "datePosted": "YYYY-MM-DD" or null,
        "dateClosing": "YYYY-MM-DD" or null,
        "isNew": boolean,
        "descriptionShort": "Brief summary.",
        "applyUrl": "URL"
      }
    ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text;
    if (!text) return createFallback(teamConfig, today);

    let cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const firstBracket = cleanJson.indexOf('[');
    const lastBracket = cleanJson.lastIndexOf(']');
    
    if (firstBracket !== -1 && lastBracket !== -1) {
      cleanJson = cleanJson.substring(firstBracket, lastBracket + 1);
    } else {
       // If JSON parsing fails, return fallback
       return createFallback(teamConfig, today);
    }

    const data = JSON.parse(cleanJson) as JobPosting[];
    
    if (!Array.isArray(data) || data.length === 0) {
        return createFallback(teamConfig, today);
    }

    return data.map((job, index) => ({
        ...job,
        id: `${teamConfig.id}-${index}-${Date.now()}`, // Ensure unique IDs
        team: teamConfig.name,
        // Double check URL is present
        applyUrl: job.applyUrl || teamConfig.url
    }));

  } catch (error) {
    console.error(`Error fetching for ${teamConfig.name}:`, error);
    return createFallback(teamConfig, today);
  }
};

function createFallback(teamConfig: TeamConfig, date: string): JobPosting[] {
    // Fallback card that encourages users to check the site directly if the crawl fails
    return [{
        id: `fallback-${teamConfig.id}-${Date.now()}`,
        title: `View All Openings at ${teamConfig.name}`,
        team: teamConfig.name,
        location: "Global / HQ",
        department: "All Departments",
        datePosted: date,
        dateClosing: undefined,
        isNew: false,
        descriptionShort: "Direct link to the official career portal.",
        applyUrl: teamConfig.url
    }];
}