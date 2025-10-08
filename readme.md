# 🤖 FAQ Chatbot

Hey there! Welcome to our intelligent FAQ chatbot - your friendly AI assistant that learns from your questions and answers to provide instant, relevant responses.

## ✨ What This Does

Imagine having a smart assistant that remembers everything you teach it. This chatbot uses AI to understand the meaning behind questions (not just keywords) and finds the best answers from your knowledge base. Perfect for customer support, internal FAQs, or any scenario where you need quick, accurate answers.

## � Screenshots

*Add your UI screenshot here*

![FAQ Chatbot Interface](images/UI.png)

## �🚀 Quick Start

### Prerequisites
- Python 3.8+
- MySQL database
- A cup of coffee ☕

### Installation

1. **Clone and setup:**
   ```bash
   git clone https://github.com/arpitjainnn14/FAQ.git
   cd FAQ
   ```

2. **Install dependencies:**
   ```bash
   pip install fastapi uvicorn sqlalchemy pymysql sentence-transformers python-dotenv numpy
   ```

3. **Database setup:**
   - Create a MySQL database
   - Update `.env` file with your credentials:
   ```
   DB_USER=your_username
   DB_PASS=your_password
   ```

4. **Run the application:**
   ```bash
   python main.py
   ```

5. **Open your browser:**
   Visit `http://localhost:8000` and start chatting!

## 🎯 How It Works

### Smart Learning
- **Semantic Search**: Uses AI to understand question meaning, not just keywords
- **Similarity Matching**: Finds the most relevant answers using advanced embeddings
- **Continuous Learning**: Add new Q&A pairs through the management panel

### Features
- 💬 **Real-time Chat**: Instant responses with typing indicators
- 📝 **Q&A Management**: Add, update, and delete knowledge base entries
- 🎨 **Modern UI**: Beautiful, responsive interface that works on any device
- 🔍 **Intelligent Matching**: AI-powered similarity search for accurate answers
- 📊 **Database Driven**: Persistent storage with MySQL

## 🛠️ API Endpoints

- `POST /chat` - Send a message and get AI response
- `GET /qa` - List all Q&A pairs
- `POST /qa` - Add new Q&A pair
- `PUT /qa/{id}` - Update existing Q&A
- `DELETE /qa/{id}` - Remove Q&A pair

## 📁 Project Structure

```
├── main.py              # FastAPI app with database models & schemas
├── utils.py             # AI analysis & CRUD operations
├── frontend/
│   ├── index.html       # Modern chat interface
│   ├── style.css        # Beautiful styling
│   └── script.js        # Interactive functionality
├── .env                 # Database credentials (keep secret!)
└── readme.md           # This file!
```

## 🎨 Frontend Features

- **Two-Panel Layout**: Chat on the left, management on the right
- **Tabbed Interface**: Organized Add/Update/Delete operations
- **Real-time Updates**: Instant feedback for all operations
- **Responsive Design**: Looks great on desktop, tablet, and mobile
- **Smooth Animations**: Polished user experience

## 🔧 Customization

### Changing the AI Model
Edit `utils.py` to use different SentenceTransformer models:
```python
# For different languages or better accuracy
self.analyzer = SentenceTransformer('all-MiniLM-L6-v2')  # English
# self.analyzer = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')  # Multi-language
```

### Styling
Modify `frontend/style.css` to match your brand colors using CSS variables.

## 🤝 Contributing

Found a bug or have a cool feature idea? We'd love your help!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

---

Built with ❤️ using FastAPI, SentenceTransformers, and modern web technologies.

*Last updated: October 8, 2025*</content>
<parameter name="filePath">C:\Users\ASUS\Documents\Project internship\readme.md
