import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox"; // 包含 ethers、chai 等常用工具
import "@nomicfoundation/hardhat-ethers";
import "@fhevm/hardhat-plugin";            // FHE 插件

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    sepolia: {
      chainId: 11155111,
      url: "https://sepolia.drpc.org", // 公共 Sepolia RPC
      accounts: [], // 部署脚本里动态输入私钥
    },
  },
  solidity: {
    version: "0.8.24", // 与合约保持一致
    settings: {
      optimizer: {
        enabled: true,
        runs: 800,
      },
      metadata: {
        bytecodeHash: "none", // 避免 metadata hash
      },
      evmVersion: "cancun",
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  typechain: {
    outDir: "types",
    target: "ethers-v6",
  },
  etherscan: {
    apiKey: {
      sepolia: "", // 如果需要验证，可填入 ETHERSCAN_API_KEY
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS ? true : false,
    currency: "USD",
  },
};

export default config;
