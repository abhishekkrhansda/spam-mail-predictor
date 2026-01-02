# Use stable Python version
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Upgrade pip and install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Expose port
EXPOSE 5000

# Start the app
CMD ["python", "app.py"]
