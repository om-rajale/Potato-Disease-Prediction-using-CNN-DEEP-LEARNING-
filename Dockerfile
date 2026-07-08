FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Since Dockerfile is at the root, requirements is inside api/
COPY api/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire folders into the container
COPY api/ ./api/
COPY potato-disease/ ./potato-disease/

EXPOSE 8000

CMD ["python", "api/main.py"]