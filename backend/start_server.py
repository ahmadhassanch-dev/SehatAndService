import asyncio
import sys
import os
import uvicorn

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    # Get port from environment variable (for Railway, Render, etc.) or use default
    port = int(os.getenv("PORT", 8003))
    host = "0.0.0.0"  # Listen on all interfaces for deployment
    
    uvicorn.run("app.main:app", host=host, port=port, log_level="info")
