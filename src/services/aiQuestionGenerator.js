import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const DIFFICULTY_PROMPTS = {
  1: "Create very basic, beginner-friendly questions about Hindu mythology and Indian culture",
  2: "Create easy questions about Hindu mythology, festivals, and basic Indian traditions",
  3: "Create moderate difficulty questions about Hindu gods, epics, and Indian cultural practices",
  4: "Create challenging questions about Hindu philosophy, scriptures, and detailed cultural aspects",
  5: "Create expert-level questions about advanced Hindu concepts, Vedic knowledge, and complex cultural traditions"
};

export const generateQuestions = async (level, count = 5) => {
  const prompt = `
    Generate ${count} multiple-choice questions about Hindu mythology and Indian culture.
    Difficulty level: ${level} (${DIFFICULTY_PROMPTS[level]})
    
    Format each question as a JSON object with:
    - question (string)
    - options (array of 4 objects with text and isCorrect)
    - explanation (string explaining the correct answer)
    - category (string: "mythology", "culture", "festival", "history")
    - level (number)
    
    Make sure questions are:
    - Culturally accurate and respectful
    - Age-appropriate
    - Educational and engaging
    - Factually correct
    
    Return as a JSON array.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a knowledgeable expert in Hindu mythology and Indian culture, creating educational content for children."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
}; 