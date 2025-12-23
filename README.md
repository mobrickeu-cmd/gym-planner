# Gym Planner - Appointment Scheduling Application

A modern web application for gym trainers to schedule appointments with customers.

## Features

### Customer Management
- **Customer Profile**: Each customer can be configured with:
  - Name (string)
  - Age (float)
  - Weight (float)
  - Premium status (boolean)
  - Number of sessions (float)

### Calendar System
- **Month Navigation**: 
  - Previous/Next month buttons
  - Quick selection for previous 3 months and next 3 months
  - "Select Any Month" button for any month from 2027-2030
- **Calendar Grid**: Displays all days of the selected month
- **Date Range**: Calendar generates for the next 4 years (up to and including 2030)

### Reservation System
- **Time Slots**: Hourly time slots (00:00 to 23:00) for each day
- **Session Tracking**: 
  - Each reservation decreases customer session count by 1
  - Customers cannot make reservations when sessions reach 0
- **Visual Indicators**: 
  - Days with reservations are highlighted
  - Double-click on a day to view all reservations

### User Roles

#### Customer
- Must set up customer profile before making reservations
- Limited by session count
- Can view and make their own reservations

#### Gym Trainer
- No session limitations
- Can view all customer reservations
- Can make unlimited reservations

### Testing
- Landing page with role selection buttons for easy testing
- Switch between Trainer and Customer views

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

### Usage

1. **Select Role**: On the landing page, click either "Gym Trainer" or "Customer"
2. **Customer Setup** (if Customer): Fill in your customer information and click "Create Customer"
3. **Navigate Calendar**: Use the navigation buttons or quick month selectors to choose a date
4. **Make Reservation**: Click on any future date, select a time slot, and confirm
5. **View Reservations**: Double-click on any day with reservations to see the details

## Technology Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **LocalStorage** for data persistence
- **CSS3** for styling with modern gradients and animations

## Project Structure

```
src/
├── components/          # React components
│   ├── Calendar.tsx     # Main calendar component
│   ├── CustomerSetup.tsx # Customer profile form
│   ├── LandingPage.tsx  # Role selection page
│   ├── TimeSlotModal.tsx # Time slot selection modal
│   └── ReservationList.tsx # Reservation viewing modal
├── context/             # React context for state management
│   └── AppContext.tsx   # Global app state
├── services/            # Data services
│   └── storage.ts       # LocalStorage operations
├── utils/               # Utility functions
│   └── dateUtils.ts     # Date manipulation helpers
├── types.ts             # TypeScript type definitions
├── App.tsx              # Main app component
└── main.tsx             # Entry point
```

## Data Persistence

All data (customers and reservations) is stored in the browser's LocalStorage, so it persists between sessions but is specific to each browser/device.

