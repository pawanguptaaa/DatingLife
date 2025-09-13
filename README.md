# DatingLife - Company Dating App

A full-stack dating application designed specifically for company employees to connect with colleagues. Built with Spring Boot backend and React TypeScript frontend.

## Features

### Core Features
- **User Authentication**: Secure JWT-based authentication
- **Profile Management**: Create and edit detailed profiles with job info
- **Smart Matching**: Department-based matching algorithm
- **Like/Pass System**: Swipe-like interface for discovering colleagues
- **Real-time Messaging**: Chat with matched users
- **Match Management**: View all your matches in one place

### Key Highlights
- Company-specific filtering (same department matching)
- Professional profile fields (job title, department)
- Secure messaging only between matched users
- Mobile-responsive design
- Real-time message updates

## Tech Stack

### Backend
- **Spring Boot 3.2.1** - Main framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database operations
- **H2 Database** - In-memory database (easily replaceable)
- **JWT** - Token-based authentication
- **Maven** - Dependency management

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS3** - Styling

## Quick Start

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup

1. **Clone and navigate to project**
   ```bash
   cd DatingLife
   ```

2. **Run the Spring Boot application**
   ```bash
   ./gradlew bootRun
   ```
   
   The backend will start on `http://localhost:8080`

3. **Access H2 Console** (optional)
   - URL: `http://localhost:8080/h2-console`
   - JDBC URL: `jdbc:h2:mem:testdb`
   - Username: `sa`
   - Password: `password`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the React application**
   ```bash
   npm start
   ```
   
   The frontend will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

### User Management
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/matches` - Get potential matches

### Matching System
- `POST /api/matches/like/{userId}` - Like a user
- `POST /api/matches/reject/{userId}` - Reject a user
- `GET /api/matches/my-matches` - Get all matches
- `GET /api/matches/pending` - Get pending matches

### Messaging
- `POST /api/messages/send` - Send a message
- `GET /api/messages/conversation/{userId}` - Get conversation
- `GET /api/messages/unread` - Get unread messages

## Application Flow

1. **Registration**: New users create accounts with company details
2. **Profile Setup**: Users complete their profiles with job information
3. **Discovery**: Browse potential matches from the same department
4. **Matching**: Like or pass on potential matches
5. **Messaging**: Chat with mutual matches
6. **Profile Management**: Update profile information anytime

## Database Schema

### Users Table
- Personal information (name, email, birth date)
- Professional information (department, job title)
- Profile details (bio, profile image)
- Authentication data (username, password hash)
- Preferences (interested genders)

### Matches Table
- User relationships (user1, user2)
- Match status (pending, matched, rejected)
- Timestamps (created, matched)

### Messages Table
- Conversation data (sender, recipient, content)
- Message metadata (sent time, read time)

## Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Encryption**: BCrypt hashing
- **API Protection**: All endpoints except auth require valid tokens
- **CORS Configuration**: Properly configured for frontend
- **Input Validation**: Server-side validation for all inputs

## Customization

### Database
Replace H2 with production database by updating `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/datinglife
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

### Matching Algorithm
Modify `UserRepository.findPotentialMatches()` to customize matching logic:
- Add age-based filtering
- Include skills or interests matching
- Implement compatibility scoring

### Frontend Styling
- Update CSS variables in `index.css`
- Customize component styles
- Add theme switching capability

## Development

### Running Tests
```bash
# Backend tests
./gradlew test

# Frontend tests
cd frontend && npm test
```

### Building for Production
```bash
# Backend
./gradlew build

# Frontend
cd frontend && npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include steps to reproduce any bugs

---

**Note**: This application is designed for internal company use. Ensure compliance with your company's HR policies before deployment.