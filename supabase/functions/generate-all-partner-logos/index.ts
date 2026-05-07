import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PARTNERS = [
  { id: "lovable", name: "Lovable", accent: "violet" },
  { id: "openai", name: "OpenAI", accent: "cool white" },
  { id: "claude", name: "Claude", accent: "gold" },
  { id: "perplexity", name: "Perplexity", accent: "electric blue" },
  { id: "solana", name: "Solana", accent: "purple/teal" },
  { id: "phantom", name: "Phantom", accent: "amethyst" },
  { id: "discord", name: "Discord", accent: "blurple" },
  { id: "twitch", name: "Twitch", accent: "purple" },
  { id: "x", name: "X", accent: "neutral white" },
  { id: "youtube", name: "YouTube", accent: "soft red" }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Starting batch partner logo generation...');
    const results = [];

    for (const partner of PARTNERS) {
      console.log(`Generating logo for ${partner.name} with ${partner.accent} accent...`);

      const prompt = `Create a single cosmic partner badge PNG for "${partner.name}" with a ${partner.accent} neon aura.

Follow the Planet CUHZ badge spec:
- Rounded-rect badge shape with subtle inner shadow
- Ultra-dark violet/black gradient interior (#0a0015 to #1a0530)
- White geometric sans-serif wordmark centered (SemiBold/Bold weight, #FFFFFF)
- Soft neon outer glow matching the ${partner.accent} accent
- 48px padding on all sides for safe area
- 1024×512 aspect ratio
- Transparent background (PNG format)
- No icons, no extra marks, no brand logos
- EXACTLY ONE image, no duplicates, no grids

Typography rules:
- Weight: SemiBold to Bold
- Normal kerning, no stretched or warped text
- Pure white text with faint neon rim that harmonizes with badge glow
- High legibility, crisp rendering

Badge structure:
- Cosmic, sleek, high-contrast style
- Purple/black aura with soft neon outer glow
- Minimal, no busy textures
- Professional and cohesive with Planet CUHZ cosmic theme`;

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash-image-preview',
          messages: [
            { role: 'user', content: prompt }
          ],
          modalities: ['image', 'text']
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error generating ${partner.name}:`, response.status, errorText);
        
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: 'Payment required. Please add credits to your Lovable AI workspace.' }),
            { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        throw new Error(`AI gateway error for ${partner.name}: ${response.status}`);
      }

      const data = await response.json();
      const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      if (!imageUrl) {
        console.error(`No image returned for ${partner.name}`);
        continue;
      }

      results.push({
        id: partner.id,
        name: partner.name,
        accent: partner.accent,
        imageData: imageUrl, // base64 data URL
        filename: `${partner.id}.png`
      });

      console.log(`✓ Generated ${partner.name}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        count: results.length,
        logos: results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-all-partner-logos:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
