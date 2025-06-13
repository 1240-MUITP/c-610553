
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    console.log('Checking for OpenAI API key...', openAIApiKey ? 'Found' : 'Not found');
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not found in environment variables');
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured. Please add your API key in Supabase Edge Function Secrets.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, context } = await req.json();
    console.log('Processing action:', action, 'with context length:', context?.length || 0);

    let systemPrompt = "";
    let userPrompt = "";

    switch (action) {
      case 'generate_ideas':
        systemPrompt = "You are a creative AI assistant that generates innovative and diverse ideas. Focus on creativity, feasibility, and uniqueness. Always respond with a JSON array of ideas.";
        userPrompt = `Based on the current context: ${context}, generate 3-5 creative ideas that could be valuable additions to this creative brain network. Format your response as a JSON array with objects containing 'name', 'type', and 'description' fields. Example: [{"name": "Idea Name", "type": "Creative", "description": "Brief description"}]`;
        break;
      
      case 'chat_with_brain':
        systemPrompt = "You are a creative companion AI that helps users explore and develop their ideas. You understand the interconnected nature of creative thinking.";
        userPrompt = `Given this creative context: ${context}, provide insightful feedback, suggestions, or questions that could help develop these ideas further. Be conversational and encouraging.`;
        break;
      
      case 'synthesize_all':
        systemPrompt = "You are an AI that excels at finding patterns, connections, and synthesis across diverse ideas and concepts.";
        userPrompt = `Analyze this collection of ideas: ${context}. Identify interesting patterns, potential connections, and synthesize insights that could lead to new creative directions. Provide a comprehensive analysis with actionable insights.`;
        break;
      
      default:
        throw new Error('Invalid action specified');
    }

    console.log('Making OpenAI API request with action:', action);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    console.log('OpenAI API response received successfully');

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid response format from OpenAI API:', data);
      throw new Error('Invalid response format from OpenAI API');
    }

    const result = data.choices[0].message.content;
    console.log('Returning result with length:', result?.length || 0);

    return new Response(JSON.stringify({ result, action }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in brain-ai function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Unknown error occurred',
      details: 'Check the function logs for more information'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
