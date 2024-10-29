import dotenv from 'dotenv';
dotenv.config(); 

export async function fetchFunFact() {
    try {
      const response = await fetch('https://api.api-ninjas.com/v1/facts', {
        headers: {
          'X-Api-Key': process.env.X_API_KEY,
        }
      });
      const data = await response.json();
      console.log("Fun fact : " + data[0].fact)
     return data[0].fact;
     
    } catch (error) {
      console.error("Error fetching fun fact:", error);
    }
  }

