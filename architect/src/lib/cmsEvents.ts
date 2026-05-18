type Client = {
  id: string;
  page: string;
  controller: ReadableStreamDefaultController;
};

const globalForEvents = global as unknown as {
  clients: Client[];
};

if (!globalForEvents.clients) {
  globalForEvents.clients = [];
}

export const cmsEvents = {
  addClient(id: string, page: string, controller: ReadableStreamDefaultController) {
    globalForEvents.clients.push({ id, page, controller });
    console.log(`[SSE] Client connected. Total clients: ${globalForEvents.clients.length}`);
  },
  
  removeClient(id: string) {
    globalForEvents.clients = globalForEvents.clients.filter(c => c.id !== id);
    console.log(`[SSE] Client disconnected. Total clients: ${globalForEvents.clients.length}`);
  },
  
  broadcastCMSChange(page: string) {
    const encoder = new TextEncoder();
    console.log(`[SSE] Broadcasting change for page: ${page} to ${globalForEvents.clients.length} clients`);
    
    // Copy array to prevent mutation issues during loops
    const activeClients = [...globalForEvents.clients];
    
    activeClients.forEach(client => {
      try {
        // Enviar evento si la página coincide, si es global, o si el cliente está escuchando cambios globales
        client.controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'update', page })}\n\n`)
        );
      } catch (err) {
        console.log(`[SSE] Failed sending to client ${client.id}, removing...`);
        globalForEvents.clients = globalForEvents.clients.filter(c => c.id !== client.id);
      }
    });
  }
};
