FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install minimal build dependencies for packages that need compilation
RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
	   build-essential gcc libssl-dev libffi-dev \
	&& rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --upgrade pip \
	&& pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY . ./

# Default port (adjust if your app uses a different one)
EXPOSE 5000

# Run the application
CMD ["python", "app.py"]