# README.md

# ChatGPT Web Chat

This project is a simple web application that allows users to interact with OpenAI's ChatGPT model through a chat interface. Users can send messages and receive responses in real-time.

## Project Structure

- `public/index.html`: Contains the HTML structure for the web application, including a chat interface.
- `.env`: Contains environment variables, including the OpenAI API key.
- `package.json`: Configuration file for npm, listing project dependencies and metadata.
- `server.js`: Main server file that sets up an Express server and handles chat requests.

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd chatgpt-webapp
   ```

2. **Install Dependencies**
   Make sure you have Node.js installed. Then run:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the Server**
   Start the server with the following command:
   ```bash
   node server.js
   ```

5. **Access the Application**
   Open your web browser and navigate to `http://localhost:5000/public/index.html` to use the chat application.

## Usage

- Type your message in the input field and click the "Send" button or press Enter.
- The application will display your message and the response from ChatGPT.

## Suggested Improvements

- Enhance the user interface for a better experience.
- Implement more robust error handling in the server code.
- Organize the code for improved readability and maintainability.

## License

This project is licensed under the ISC License.