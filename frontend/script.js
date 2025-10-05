class ChatBot {
    constructor() {
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.chatMessages = document.getElementById('chatMessages');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        
        this.init();
    }
    
    init() {
        // Event listeners
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Auto-resize input and focus
        this.messageInput.focus();
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        
        if (!message) {
            return;
        }
        
        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input and disable send button
        this.messageInput.value = '';
        this.toggleSendButton(false);
        
        try {
            // Show loading indicator
            this.showLoading();
            
            // Send message to backend (you'll need to replace this with your actual API endpoint)
            const response = await this.sendToAPI(message);
            
            // Add bot response to chat
            this.addMessage(response, 'bot');
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.addMessage('Sorry, I encountered an error. Please try again.', 'bot', true);
        } finally {
            // Hide loading indicator and re-enable send button
            this.hideLoading();
            this.toggleSendButton(true);
            this.messageInput.focus();
        }
    }
    
    async sendToAPI(message) {
        // Replace this URL with your actual FastAPI endpoint
        const API_URL = 'http://localhost:8000/chat'; // Adjust this to match your FastAPI server
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    // Add any other required fields based on your FastAPI schema
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Adjust this based on your FastAPI response structure
            return data.response || data.message || 'No response received';
            
        } catch (error) {
            console.error('API Error:', error);
            
            // Fallback response for demonstration
            return this.generateFallbackResponse(message);
        }
    }
    
    generateFallbackResponse(message) {
        // Simple fallback responses for demonstration
        const responses = [
            "I understand you're asking about: " + message,
            "That's an interesting question about " + message,
            "Let me think about " + message,
            "Thanks for asking about " + message,
            "I'd be happy to help with " + message
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    addMessage(text, sender, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        if (isError) {
            messageContent.className += ' error-message';
        }
        
        // Handle text formatting (basic markdown-like support)
        const formattedText = this.formatText(text);
        messageContent.innerHTML = formattedText;
        
        messageDiv.appendChild(messageContent);
        this.chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        this.scrollToBottom();
        
        // Add animation
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            messageDiv.style.transition = 'all 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        });
    }
    
    formatText(text) {
        // Basic text formatting
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
            .replace(/`(.*?)`/g, '<code>$1</code>') // Code
            .replace(/\n/g, '<br>'); // Line breaks
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    showLoading() {
        this.loadingIndicator.classList.add('show');
    }
    
    hideLoading() {
        this.loadingIndicator.classList.remove('show');
    }
    
    toggleSendButton(enabled) {
        this.sendButton.disabled = !enabled;
    }
    
    // Method to clear chat history
    clearChat() {
        this.chatMessages.innerHTML = `
            <div class="message bot-message">
                <div class="message-content">
                    <p>Hello! I'm your AI assistant. How can I help you today?</p>
                </div>
            </div>
        `;
    }
    
    // Method to add typing indicator
    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-animation">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
        
        return typingDiv;
    }
    
    removeTypingIndicator() {
        const typingIndicator = this.chatMessages.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
}

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const chatBot = new ChatBot();
    
    // Make chatBot globally accessible for debugging
    window.chatBot = chatBot;

    // CRUD Operations
    const addForm = document.getElementById('addForm');
    const updateForm = document.getElementById('updateForm');
    const deleteForm = document.getElementById('deleteForm');
    const crudMessage = document.getElementById('crudMessage');

    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const question = document.getElementById('addQuestion').value.trim();
        const answer = document.getElementById('addAnswer').value.trim();
        if (!question || !answer) return;
        crudMessage.textContent = 'Adding...';
        try {
            const res = await fetch('http://localhost:8000/qa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question, answer })
            });
            if (!res.ok) throw new Error('Add failed');
            crudMessage.textContent = 'Added successfully!';
            addForm.reset();
        } catch (err) {
            crudMessage.textContent = 'Error adding Q&A.';
        }
    });

    updateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('updateId').value;
        const question = document.getElementById('updateQuestion').value.trim();
        const answer = document.getElementById('updateAnswer').value.trim();
        if (!id || (!question && !answer)) return;
        crudMessage.textContent = 'Updating...';
        try {
            // Get existing Q&A
            const getRes = await fetch(`http://localhost:8000/qa/${id}`);
            if (!getRes.ok) throw new Error('Q&A not found');
            const qa = await getRes.json();
            // Prepare updated data
            const updated = {
                question: question || qa.question,
                answer: answer || qa.answer
            };
            // Update Q&A
            const res = await fetch(`http://localhost:8000/qa/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated)
            });
            if (!res.ok) throw new Error('Update failed');
            crudMessage.textContent = 'Updated successfully!';
            updateForm.reset();
        } catch (err) {
            crudMessage.textContent = 'Error updating Q&A.';
        }
    });

    deleteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('deleteId').value;
        if (!id) return;
        crudMessage.textContent = 'Deleting...';
        try {
            const res = await fetch(`http://localhost:8000/qa/${id}`, {
                method: 'DELETE' });
            if (!res.ok) throw new Error('Delete failed');
            crudMessage.textContent = 'Deleted successfully!';
            deleteForm.reset();
        } catch (err) {
            crudMessage.textContent = 'Error deleting Q&A.';
        }
    });
});

// Additional CSS for typing indicator (add this to your CSS file)
const additionalCSS = `
.typing-indicator .message-content {
    padding: 16px 20px;
}

.typing-animation {
    display: flex;
    align-items: center;
    gap: 4px;
}

.typing-animation span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #666;
    animation: typing 1.4s ease-in-out infinite both;
}

.typing-animation span:nth-child(1) {
    animation-delay: 0s;
}

.typing-animation span:nth-child(2) {
    animation-delay: 0.2s;
}

.typing-animation span:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes typing {
    0%, 60%, 100% {
        transform: translateY(0);
        opacity: 0.4;
    }
    30% {
        transform: translateY(-10px);
        opacity: 1;
    }
}
`;

// Inject additional CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);