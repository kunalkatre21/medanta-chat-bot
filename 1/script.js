/**
 * Medanta Assist - Healthcare Chatbot
 * A modern, component-based chat interface using DaisyUI
 */

class MedantaChatbot {
    constructor() {
        this.chatBox = document.getElementById('chat-box');
        this.userInput = document.getElementById('user-input');
        this.chatForm = document.getElementById('chat-form');
        this.conversationState = 0;
        this.userSymptoms = [];
        
        this.initializeEventListeners();
        this.startConversation();
    }

    /**
     * Initialize event listeners
     */
    initializeEventListeners() {
        this.chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleUserInput();
        });

        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleUserInput();
            }
        });
    }

    /**
     * Bot conversation flow
     */
    getBotMessages() {
        return [
            { // 0: Initial message
                text: "Hi, I'm Medanta Assist, your personal support for all medical needs. How can I help you?",
                options: ["Help me find a doctor", "I want to book appointment", "I have an emergency"]
            },
            { // 1: After selecting "I want to book appointment"
                text: "Hello! I'm Medanta Assist your healthcare appointment assistant. I can help you:<br><ul><li>Book a follow-up appointment with your doctor</li><li>Find a specialist for your symptoms</li><li>Schedule a new consultation</li></ul><br>To get started, could you let me know:<br>Are you looking to book with a specific doctor you've seen before? Or do you need help finding the right specialist for your symptoms?",
                input: true
            },
            { // 2: Ask for symptoms
                text: "I'll help you find the right specialist for your symptoms. Let me understand your symptoms better. Please describe your symptoms.",
                input: true
            },
            { // 3: Refine headache symptoms
                text: "I see you mentioned headache. To help me understand better, please select any of the following that apply:",
                checkboxes: ["Sudden, severe headache", "Headache with fever", "Headache with vision changes or blurred vision", "Headache with nausea or vomiting", "Headache with neck stiffness", "Headache with dizziness", "None of the above"]
            },
            { // 4: Ask about duration
                text: "I understand you're experiencing headache with nausea/vomiting and dizziness. Let me gather a bit more information. How long has this been going on?",
                options: ["Started suddenly today", "Been going on for a few days", "Recurring for weeks/months", "Chronic condition I've had for years"]
            },
            { // 5: Ask about pain type
                text: "Thank you for the information. One more question to help me find the right specialist: What does the pain feel like?",
                checkboxes: ["Throbbing/pulsating pain", "Constant dull ache", "Sharp/stabbing pain", "Pressure-like sensation", "None of the above"]
            },
            { // 6: Suggest specialist and ask for location
                text: "Based on your symptoms, I can help you find the right specialist. If you have any medical records or previous reports, feel free to upload them. It's completely okay if you don't have any.<br><br>Now, which city are you located in?",
                input: true
            },
            { // 7: Show doctors
                text: "Great! Let me find neurologists in your city. I found several specialists who can help with your symptoms. Here are some excellent options:",
                doctors: [
                    { name: "Dr. Neelesh Kapoor", speciality: "Internal Medicine", exp: "38 years", timings: "Mon-Sat, 10:00 AM - 4:00 PM", languages: "English, Hindi" }
                ]
            },
            { // 8: Show availability
                text: "Great choice! Let me check Dr. Neelesh Kapoor's availability for you. Let me show you the appointment options:",
                availability: true
            },
            { // 9: Appointment confirmed
                text: "Appointment confirmed!",
                options: ["Make Payment"]
            },
            { // 10: Payment
                text: "Redirecting to payment..."
            }
        ];
    }

    /**
     * Start the conversation
     */
    startConversation() {
        setTimeout(() => this.displayBotMessage(), 500);
    }

    /**
     * Display bot message based on current state
     */
    displayBotMessage() {
        const message = this.getBotMessages()[this.conversationState];
        this.addMessage(message.text, 'bot');
        
        if (message.options) this.addOptions(message.options);
        if (message.checkboxes) this.addCheckboxes(message.checkboxes);
        if (message.doctors) message.doctors.forEach(doc => this.showDoctorCard(doc));
        if (message.availability) this.showAvailability();
        
        this.userInput.disabled = !message.input;
    }

    /**
     * Add a message to the chat
     */
    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat ${sender === 'bot' ? 'chat-start' : 'chat-end'}`;
        messageDiv.style.animation = 'messageSlide 0.3s ease-out';

        const currentTime = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });

        // Add chat header with sender name and time
        const headerDiv = document.createElement('div');
        headerDiv.className = 'chat-header';
        headerDiv.innerHTML = `
            ${sender === 'bot' ? 'Medanta Assist' : 'You'}
            <time class="text-xs opacity-50">${currentTime}</time>
        `;
        messageDiv.appendChild(headerDiv);

        // Message bubble with appropriate color
        const messageContent = document.createElement('div');
        let bubbleClass = 'chat-bubble';
        
        if (sender === 'bot') {
            bubbleClass += ' chat-bubble-primary';
        } else {
            bubbleClass += ' chat-bubble-secondary';
        }
        
        // Add special styling for different message types
        if (text.includes('confirmed') || text.includes('successful')) {
            bubbleClass += ' chat-bubble-success';
        } else if (text.includes('error') || text.includes('sorry') || text.includes('not implemented')) {
            bubbleClass += ' chat-bubble-error';
        } else if (text.includes('warning') || text.includes('caution')) {
            bubbleClass += ' chat-bubble-warning';
        }
        
        // Add appointment confirmation class for full width
        if (text.includes('Appointment Confirmed') || text.includes('Payment approved successfully')) {
            bubbleClass += ' appointment-confirmation';
        }
        
        messageContent.className = bubbleClass;
        messageContent.innerHTML = text;

        // Add message status footer
        const footerDiv = document.createElement('div');
        footerDiv.className = 'chat-footer opacity-50';
        footerDiv.textContent = sender === 'bot' ? 'Delivered' : 'Seen';
        messageDiv.appendChild(footerDiv);

        messageDiv.appendChild(messageContent);

        this.chatBox.appendChild(messageDiv);
        this.scrollToBottom();
    }

    /**
     * Add option buttons
     */
    addOptions(options) {
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'join join-vertical w-full mt-2';
        
        options.forEach(optionText => {
            const button = document.createElement('button');
            button.textContent = optionText;
            button.className = 'btn btn-outline btn-primary join-item text-left normal-case';
            button.onclick = () => this.handleOptionClick(optionText);
            optionsDiv.appendChild(button);
        });
        
        this.chatBox.appendChild(optionsDiv);
        this.scrollToBottom();
    }

    /**
     * Add checkbox options
     */
    addCheckboxes(options) {
        const form = document.createElement('form');
        form.className = 'form-control w-full mt-2';
        
        options.forEach(optionText => {
            const label = document.createElement('label');
            label.className = 'label cursor-pointer gap-3';
            label.innerHTML = `
                <input type="checkbox" value="${optionText}" class="checkbox checkbox-primary">
                <span class="label-text">${optionText}</span>
            `;
            form.appendChild(label);
        });
        
        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = 'Confirm';
        confirmBtn.className = 'btn btn-primary w-full mt-4';
        confirmBtn.onclick = (e) => {
            e.preventDefault();
            const selected = Array.from(form.querySelectorAll('input:checked')).map(cb => cb.value);
            this.handleCheckboxConfirm(selected);
        };
        
        form.appendChild(confirmBtn);
        this.chatBox.appendChild(form);
        this.scrollToBottom();
    }

    /**
     * Show doctor card
     */
    showDoctorCard(doctor) {
        const card = document.createElement('div');
        card.className = 'card bg-base-100 shadow-xl p-6 mt-4';
        card.innerHTML = `
            <div class="card-body p-0">
                <h4 class="card-title">${doctor.name}</h4>
                <p class="text-base-content/70">${doctor.speciality} - ${doctor.exp}</p>
                <p class="text-base-content/70">🕒 ${doctor.timings}</p>
                <p class="text-base-content/70">🗣️ ${doctor.languages}</p>
            </div>
        `;
        
        const button = document.createElement('button');
        button.textContent = "Show available slots";
        button.className = 'btn btn-primary w-full mt-4';
        button.onclick = () => this.handleOptionClick("Show available slots");
        card.appendChild(button);
        
        this.chatBox.appendChild(card);
        this.scrollToBottom();
    }

    /**
     * Show time slot availability
     */
    showAvailability() {
        const container = document.createElement('div');
        container.className = 'card bg-base-100 shadow-xl p-6 mt-4';
        container.innerHTML = `
            <h4 class="card-title">Dr. Neelesh Kapoor</h4>
            <div class="grid grid-cols-3 gap-2 mt-4">
                <div class="time-slot cursor-pointer border-2 border-primary/20 rounded-lg p-2 text-center text-sm font-medium text-base-content hover:bg-primary/10 hover:border-primary transition-all" data-time="FRI 12, 14:15">FRI 12<br>14:15</div>
                <div class="time-slot cursor-pointer border-2 border-primary/20 rounded-lg p-2 text-center text-sm font-medium text-base-content hover:bg-primary/10 hover:border-primary transition-all" data-time="FRI 12, 14:45">FRI 12<br>14:45</div>
                <div class="time-slot cursor-pointer border-2 border-primary/20 rounded-lg p-2 text-center text-sm font-medium text-base-content hover:bg-primary/10 hover:border-primary transition-all" data-time="SAT 13, 10:30">SAT 13<br>10:30</div>
            </div>
        `;
        
        const bookBtn = document.createElement('button');
        bookBtn.textContent = 'Book Appointment';
        bookBtn.className = 'btn btn-primary w-full mt-4';
        bookBtn.onclick = () => {
            const selectedSlot = container.querySelector('.time-slot.selected');
            if (selectedSlot) {
                this.handleOptionClick(`Booked for ${selectedSlot.dataset.time}`);
            } else {
                this.showNotification('Please select a time slot.', 'warning');
            }
        };
        container.appendChild(bookBtn);

        container.querySelectorAll('.time-slot').forEach(slot => {
            slot.onclick = () => {
                container.querySelectorAll('.time-slot').forEach(s => {
                    s.classList.remove('selected', 'bg-primary', 'text-primary-content', 'border-transparent');
                });
                slot.classList.add('selected', 'bg-primary', 'text-primary-content', 'border-transparent');
            }
        });

        this.chatBox.appendChild(container);
        this.scrollToBottom();
    }

    /**
     * Handle user input
     */
    handleUserInput() {
        const text = this.userInput.value.trim();
        if (text === '') return;
        
        this.addMessage(text, 'user');
        this.userInput.value = '';
        this.userInput.disabled = true;

        setTimeout(() => {
            if (this.conversationState === 1 || this.conversationState === 2) {
                if (text.toLowerCase().includes("headache")) {
                     this.conversationState = 3;
                } else {
                    this.addMessage("Sorry, I can only assist with 'headache' symptoms in this demo.", 'bot');
                    this.conversationState = 1; // loop back
                }
            } else if (this.conversationState === 6) {
                this.conversationState = 7;
            }
            this.displayBotMessage();
        }, 1000);
    }

    /**
     * Handle option button click
     */
    handleOptionClick(optionText) {
        this.addMessage(optionText, 'user');
        
        // Disable all buttons temporarily
        this.chatBox.querySelectorAll('button').forEach(btn => {
            if (btn.id !== 'send-btn') btn.disabled = true;
        });

        setTimeout(() => {
            if (this.conversationState === 0 && optionText === "I want to book appointment") {
                this.conversationState = 1;
            } else if (this.conversationState === 4) {
                 this.conversationState = 5;
            } else if (this.conversationState === 7) {
                 this.conversationState = 8;
            } else if (this.conversationState === 8) {
                 this.conversationState = 9;
            } else if (this.conversationState === 9) {
                 this.conversationState = 10;
                 // Auto approve payment and send confirmation with appointment details
                 setTimeout(() => {
                     const appointmentDetails = `
                         <div class="appointment-details card bg-base-100 shadow-lg p-4">
                             <h4 class="font-bold text-lg mb-3">🎉 Appointment Confirmed!</h4>
                             <div class="space-y-2">
                                 <p><strong>Doctor:</strong> Dr. Neelesh Kapoor</p>
                                 <p><strong>Speciality:</strong> Internal Medicine</p>
                                 <p><strong>Date & Time:</strong> FRI 12, 14:45</p>
                                 <p><strong>Duration:</strong> 30 minutes</p>
                                 <p><strong>Location:</strong> Medanta Hospital, Gurgaon</p>
                                 <p><strong>Appointment ID:</strong> MDT${Date.now()}</p>
                                 <p><strong>Consultation Fee:</strong> ₹1,200</p>
                             </div>
                             <div class="mt-4 p-3 bg-success/10 rounded-lg">
                                 <p class="text-sm">✅ Payment successful! You will receive a confirmation SMS and email shortly.</p>
                             </div>
                         </div>
                     `;
                     this.addMessage("Payment approved successfully! Your appointment has been confirmed. " + appointmentDetails, 'bot');
                     
                     // Reset conversation after showing details
                     setTimeout(() => {
                         this.conversationState = 0; // Reset conversation
                         this.userSymptoms = []; // Reset symptoms
                     }, 5000);
                 }, 2000);
            } else {
                this.addMessage("This feature is not implemented in this demo.", 'bot');
            }
            this.displayBotMessage();
        }, 1000);
    }

    /**
     * Handle checkbox confirmation
     */
    handleCheckboxConfirm(selected) {
        this.addMessage(selected.join(', '), 'user');
        this.userSymptoms = [...this.userSymptoms, ...selected];
        
        // Remove all forms
        this.chatBox.querySelectorAll('form').forEach(form => form.remove());

        setTimeout(() => {
            if (this.conversationState === 3) {
                this.conversationState = 4;
            } else if (this.conversationState === 5) {
                this.conversationState = 6;
            }
            this.displayBotMessage();
        }, 1000);
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>${message}</span>
        `;
        
        this.chatBox.appendChild(notification);
        this.scrollToBottom();
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    /**
     * Scroll to bottom of chat
     */
    scrollToBottom() {
        this.chatBox.scrollTop = this.chatBox.scrollHeight;
    }
}

// Initialize the chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MedantaChatbot();
});