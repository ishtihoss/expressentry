import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { steps } = req.body;
      const allTasks = steps.flatMap(step => step.tasks.map(task => task.description));
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4-0125-preview",
        messages: [
          { role: "system", content: "You are a helpful assistant providing brief instructions for Express Entry tasks." },
          { role: "user", content: `Provide brief instructions (with helpful links) for the following Express Entry tasks: "${allTasks.join(', ')}"` }
        ],
        max_tokens: 2000,
      });

      const instructions = completion.choices[0].message.content.trim();
      
      // Parse the instructions and create a key-value pair for each task
      const instructionsObject = allTasks.reduce((acc, task) => {
        const taskInstructions = instructions.split(task)[1]?.split('\n')[0]?.trim();
        acc[task] = taskInstructions || 'No specific instructions available.';
        return acc;
      }, {});

      res.status(200).json({ instructions: instructionsObject });
    } catch (error) {
      console.error('Error fetching instructions:', error);
      res.status(500).json({ error: 'Error fetching instructions' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}