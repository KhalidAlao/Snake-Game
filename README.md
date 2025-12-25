Snake Game - Full Stack Portfolio Project

A modern, full-stack Snake game built with vanilla JavaScript frontend and Spring Boot backend, featuring JWT authentication, a leaderboard, and CI/CD integration. 

Features

Game Features

Classic Snake Gameplay - Smooth controls, increasing difficulty, and score tracking
Responsive Design - Works on desktop and mobile with on-screen D-pad
Light/Dark Mode - Toggle between themes with persistent preferences
Pause/Resume - Press 'P' to pause the game anytime
Game Grid - Visual grid background for better orientation
User Features

JWT Authentication - Secure user registration and login
Persistent Sessions - Token-based authentication with auto-login
User-Specific High Scores - Personal high score tracking
Profile Display - Shows logged-in username in header
eaderboard System

Global Top 5 - Real-time leaderboard showing top scores
Score Submission - Automatic submission for qualifying scores
Score Validation - Prevents duplicate submissions within time window
Timestamps - Shows when scores were achieved
Technical Features

RESTful API - Clean backend API with proper HTTP methods
Database Persistence - PostgreSQL for user data and scores
CORS Configuration - Secure cross-origin resource sharing
Input Validation - Server-side validation for all inputs
Error Handling - Graceful error handling and user feedback
Tech Stack

Frontend

Vanilla JavaScript - No frameworks, pure JS for maximum performance
HTML5 Canvas - For smooth game rendering
CSS3 - Custom properties for theming, responsive design
Vite - Build tool and development server
ESLint & Prettier - Code quality and formatting
Backend

Spring Boot 3 - Java backend framework
Spring Security - Authentication and authorization
JWT (JSON Web Tokens) - Stateless authentication
Spring Data JPA - Database abstraction
PostgreSQL - Relational database
Maven - Dependency management
DevOps & Tools

GitHub Actions - CI/CD pipeline with auto-formatting
PostgreSQL - Production database
Dotenv - Environment configuration
Jest - Testing framework (frontend)
JUnit - Testing framework (backend)

API Documentation

Authentication Endpoints

Method	Endpoint	Description	Request Body
POST	/api/auth/register	Register new user	{username, password}
POST	/api/auth/login	Login user	{username, password}
Response: {token, username}

Leaderboard Endpoints

Method	Endpoint	Description	Auth Required
GET	/api/leaderboard	Get top 5 scores	No
POST	/api/leaderboard	Submit new score	Yes (Bearer token)
DELETE	/api/leaderboard	Clear leaderboard	Yes
POST Body: {score: number}

Installation & Setup

Prerequisites

Node.js (v18 or higher)
Java 17 or higher
Maven 3.6+
PostgreSQL 14+
Git


