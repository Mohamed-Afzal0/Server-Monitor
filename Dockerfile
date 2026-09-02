# Base image - Python 3.11 lightweight version
FROM python:3.11-slim

# Set working directory inside container
WORKDIR /app

# Copy and install dependencies first
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the rest of the app
COPY . .

# Expose port 5000
EXPOSE 5000

# Command to run the app
CMD ["python", "app.py"]