Bun.serve({
    fetch(req) {
        const path  = new URL(req.url).pathname;
        const method = req.method;
        const endPoint = `${method} ${path}`;

        if (endPoint === "GET /") {
            return new Response("Hello World");
        }
        
        return new Response("Not Found", { status: 404 });
    },
  });