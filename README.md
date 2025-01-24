# YouTube Analytics Dashboard

A modern analytics dashboard for YouTube channels built with Spring Boot and React. View channel statistics, video performance, and engagement metrics in a beautiful, responsive interface.
![image](https://github.com/user-attachments/assets/45cea273-aa08-45df-b043-e00bd6791381)


## Features

- 🔍 Channel Search with instant results
- 📊 Comprehensive channel statistics
- 📈 Performance graphs for video metrics
- 🎥 Latest videos grid with engagement stats
- 🌗 Dark/Light mode support
- 📱 Fully responsive design

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- shadcn/ui components
- Recharts for data visualization
- Vite for build tooling

### Backend
- Spring Boot
- YouTube Data API
- Maven for dependency management

## Setup

### Prerequisites
- Node.js 18+ and npm
- Java 17+
- Maven
- YouTube Data API key

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd youtube-analytics-backend
   ```

2. Configure YouTube API key:
   - Create `application.properties` in `src/main/resources`
   - Add your YouTube API key:
     ```properties
     youtube.api.key=YOUR_API_KEY_HERE
     ```

3. Run the backend:
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd youtube-analytics-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open http://localhost:5173 in your browser
2. Search for a YouTube channel
3. View detailed analytics including:
   - Subscriber count
   - Total views
   - Video count
   - Average views per video
   - Recent video performance
   - Interactive graphs and charts

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
