# MongoDB Query Interface

This full-stack app makes it easy to talk to your MongoDB database using plain English. No need to write complex queries—just say what you’re looking for, and it does the rest. It’s a simple, natural way to get insights from your data.


## Tech Stack

**Frontend:** React.js, JavaScript, CSS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB Atlas  
**AI:** Google Gemini API

## Installation

### Prerequisites
- Node.js >= 14.0.0
- npm >= 6.0.0
- MongoDB Atlas account
- Google Cloud Platform account with Gemini API access

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/AksayaVenugopal/nl2mongo.git
   cd nl2mongo
   ```

2. **Backend setup**
   ```bash
   npm install
   ```
   
   Edit `server.js` and add your Gemini API key to `config.geminiApiKey`
   
   ```bash
   node server.js
   ```

3. **Frontend setup**
   ```bash
   cd client
   npm install
   npm start
   ```

## Configuration

Create a `.env` file in the root directory:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
GEMINI_API_KEY=your_gemini_api_key
```
