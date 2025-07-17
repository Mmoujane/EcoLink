export async function registerClient(category: {name: string, mail: string, type: string, accountId: string}) {
    try {
      console.log(category);
      const response = await fetch('/api/registerClient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( category ),
        credentials: 'include'
      });
  
      if (!response.ok) {
        return null;
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding new departement:', error);
      return null;
    }
  } 