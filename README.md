# 0GMD: Secure Healthcare Records on the Blockchain

0GMD is a modern web application that empowers users to securely control their healthcare records. By leveraging blockchain technology, 0GMD provides a private and secure way to store and manage medical information.

**Presentation:**

[0G MD healthcare copilot Canva](https://www.canva.com/design/DAGkbQ_5_JY/LV-zoQVCYfwQjJnS3kwwfA/view?utm_content=DAGkbQ_5_JY&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hbf8e6346c5)

**Live Demo:**

[0gmd.vercel.app](https://0gmd.vercel.app/)

## Key Features

- **Encrypted Medical Records**: Your healthcare data is encrypted and stored on the blockchain, ensuring complete privacy and security.
- **AI Health Assistant**: A sophisticated chatbot that can access and interpret your secured medical records to provide personalized health information.
- **Doctor Record Requests**: Manage requests from healthcare providers who need access to your records, maintaining control over who sees your information.
- **Medical Records Dashboard**: Easily view, organize, and manage all your health records in one place.
- **Secure File Upload**: Upload medical files directly to the blockchain with end-to-end encryption using 0G storage.

## Technology Stack

- **Next.js 15**: Modern React framework with App Router
- **React 19**: Latest React version for building the UI
- **Tailwind CSS**: Utility-first CSS framework for styling
- **0G Storage**: Decentralized storage solution for secure blockchain storage
- **Ethers.js**: Ethereum library for blockchain interactions

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/raviriley/0gmd.git
cd 0gmd
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

Create a `.env` file based on the `.env.example` with your 0G Storage and blockchain configuration:

```
OPENROUTER_API_KEY=
ZERO_G_STORAGE_RPC=https://evmrpc-testnet.0g.ai
ZERO_G_L1_RPC=https://evmrpc-testnet.0g.ai
ZERO_G_PRIVATE_KEY=
```

4. Run the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## How It Works

1. **User Authentication**: Securely log in to access your personal health dashboard.
2. **Upload Medical Records**: Upload your medical documents securely to the blockchain.
3. **Grant Access**: Control which healthcare providers can access specific records.
4. **AI Assistance**: Get personalized health insights from the AI assistant that can securely access your encrypted records.

## Security & Privacy

0GMD prioritizes your privacy:

- All medical records are encrypted before being stored on the blockchain
- You maintain complete control over who can access your records
- No third parties can access your data without explicit permission
- Blockchain technology ensures immutability and auditability of all data access
