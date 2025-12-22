export interface Question {
    id: string;
    q: string;
    options: {
        A: string;
        B: string;
        C: string;
        D: string;
    };
}

export interface GameResult {
    success: boolean;
    score: number;
    correct: number;
    total: number;
    error?: string;
}

const GAS_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;

export const api = {
    getQuestions: async (count: number = 5): Promise<Question[]> => {
        try {
            // GAS Web App URLs cause CORS issues when fetched directly from browser sometimes.
            // But typically for doGet it's fine if set to 'Anyone'.
            // If CORS fails, we might need a proxy or 'no-cors' (but then can't read body).
            // Let's assume standard fetch works if GAS is set correctly.
            const response = await fetch(`${GAS_URL}?count=${count}`);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch questions:', error);
            throw error;
        }
    },

    submitAnswers: async (id: string, answers: Record<string, string>): Promise<GameResult> => {
        try {
            // doPost in GAS often has CORS issues and requires a specific setup.
            // E.g. sending text/plain to avoid preflight options request which GAS doesn't handle.
            const payload = JSON.stringify({ id, answers });

            const response = await fetch(GAS_URL, {
                method: 'POST',
                // Important: use text/plain to avoid CORS preflight (OPTIONS)
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: payload,
            });

            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Failed to submit answers:', error);
            throw error;
        }
    }
};
