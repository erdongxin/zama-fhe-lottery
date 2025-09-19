# FHE Lottery Platform

A fully homomorphic encryption (FHE) enabled lottery system on FHEVM, providing transparent and verifiable lottery rounds on-chain.

## 🌐 Live Demo

**Try the live application:** [https://zama-fhe-lottery.vercel.app/](https://zama-fhe-lottery.vercel.app/)

![界面截图](./image.png)

## 🏛️ Project Background

Since ancient times, lotteries have been a popular way for people to chase their dreams and wealth.  
However, they have always faced significant challenges:  
- **Lack of transparency**: Participants cannot fully verify the fairness of the draw  
- **Data tampering risks**: Results can be manipulated due to insider operations or system vulnerabilities  
- **Privacy concerns**: Players' participation information is often exposed  

FHE Lottery leverages **Fully Homomorphic Encryption (FHE)** technology to tackle these issues.  
By performing computations on encrypted data directly on-chain, the system ensures:  

- Transparency and verifiability of all lottery operations  
- Immutable records that cannot be altered after creation  
- Protection of user privacy while maintaining fairness  

## 🚀 Features

### Core Functionality
- **Transparent Lottery System**: Manage rounds and ensure fair draws  
- **Ticket Participation**: Users can join lotteries securely  
- **Administrative Controls**: Authorized actions for creating rounds and managing draws  
- **Result Visibility**: Draw outcomes are verifiable and publicly accessible  
- **FHEVM Integration**: On-chain data encryption ensures trust and integrity  
- **Modern Web Interface**: User-friendly frontend with wallet connectivity  

### Privacy & Security
- **Secure Smart Contracts**: Built with audited Solidity libraries  
- **Wallet Connection**: Requires wallet integration for participation  
- **Immutable Records**: Lottery data cannot be modified after creation

## 🏗️ Architecture

### Smart Contracts

#### 1. **Lottery.sol** - Main Contract
- Manages lottery rounds and tickets
- Stores round data, prize, and winner info on-chain
- Provides admin-only functions for creating rounds and drawing numbers

### Frontend Application
- **React + TypeScript**: User interface
- **Ethers.js**: Blockchain interaction
- **Vite**: Fast build and hot reload
- **MetaMask Integration**: Connect wallet, buy tickets, draw numbers
- **Responsive Design**: Works on desktop and mobile

## 🔧 Technology Stack

### Blockchain
- **Solidity ^0.8.24**: Smart contract development
- **FHEVM**: Fully Homomorphic Encryption Virtual Machine
- **OpenZeppelin**: Secure contract libraries
- **Hardhat**: Development and deployment framework

### Frontend
- **React 18 + TypeScript**
- **Vite**
- **Tailwind CSS** (optional styling)
- **Ethers.js**
- **MetaMask wallet integration**

### Infrastructure
- **Vercel**: Frontend deployment 
- **Sepolia Testnet**: Development and testing

## 📦 Installation

### Prerequisites
- Node.js 20+
- npm / yarn / pnpm
- MetaMask wallet

### Setup

```bash
npm install
npm install --save-dev @nomicfoundation/hardhat-toolbox
npm install @zama-fhe/relayer-sdk
npm install ethers dotenv
npm install react react-dom
npx hardhat compile
npx hardhat run deploy/deploy.ts --network sepolia
cd frontend/web
npm run dev