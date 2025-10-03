// Configuración de Supabase
// Reemplaza estas URLs con las de tu proyecto de Supabase
const SUPABASE_CONFIG = {
  url: 'https://quziueqtsszpjpvjcviu.supabase.co', // Reemplaza con tu URL de Supabase
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1eml1ZXF0c3N6cGpwdmpjdml1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NDk3MDQsImV4cCI6MjA3MTIyNTcwNH0.b_LEkGjBORM98tICvL8phmgr4t-lXCly48C4B-xaEYk', // Reemplaza con tu anon key
  functionUrl: 'https://quziueqtsszpjpvjcviu.supabase.co/functions/v1/teamlineup' // URL de la Edge Function
};

// Función para realizar peticiones a la Edge Function
async function supabaseRequest(method, data = null, shortId = null) {
  try {
    const url = shortId 
      ? `${SUPABASE_CONFIG.functionUrl}?id=${shortId}`
      : SUPABASE_CONFIG.functionUrl;
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_CONFIG.anonKey,
        'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
      }
    };

    if (data && method === 'POST') {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Error en la petición');
    }
    
    return result;
  } catch (error) {
    console.error('Error en supabaseRequest:', error);
    throw error;
  }
}

// Función para guardar formación en Supabase
async function saveFormationToSupabase(formationData) {
  return await supabaseRequest('POST', formationData);
}

// Función para cargar formación desde Supabase
async function loadFormationFromSupabase(shortId) {
  return await supabaseRequest('GET', null, shortId);
}