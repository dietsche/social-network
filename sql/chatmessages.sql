
DROP TABLE IF EXISTS chatMessages;

CREATE TABLE chatMessages(
    message_id SERIAL PRIMARY KEY,
    message VARCHAR(2550) NOT NULL CHECK (message != ''),
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
