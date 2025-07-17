export async function loginClient({ accountId, signature, challenge }: { accountId: string, signature: string, challenge: string }) {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accountId, signature, challenge }),
      credentials: 'include',
    });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    return null;
  }
} 