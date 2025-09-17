// deploy/deploy.ts
import fs from "fs";
import path from "path";
import readline from "readline";
import { ethers as hardhatEthers } from "hardhat"; // 用于 getContractFactory
import { Wallet, JsonRpcProvider } from "ethers";

async function ask(prompt: string) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise<string>((res) => rl.question(prompt, (ans) => { rl.close(); res(ans.trim()); }));
}

async function main() {
  const privateKey = await ask("请输入部署私钥（仅测试网）: ");
  let rpc = await ask("请输入 RPC URL（回车使用公共 Sepolia: https://sepolia.drpc.org）: ");
  if (!rpc) rpc = "https://sepolia.drpc.org";

  const provider = new JsonRpcProvider(rpc);
  const wallet = new Wallet(privateKey, provider);

  console.log("部署账户:", wallet.address);

  // 使用 hardhat 的 contract factory（注意：hardhat ethers 与 ethers 原生不完全相同，使用 factory）
  // 这里用 hardhat 里的 getContractFactory 并传入 signer 的私钥 provider
  const FHELotteryFactory = await hardhatEthers.getContractFactory("FHELottery", wallet);
  const lottery = await FHELotteryFactory.deploy();
  await lottery.waitForDeployment();

  const deployedAddress = lottery.target || (lottery as any).address;
  console.log("FHELottery 部署成功，地址:", deployedAddress);

  // 把合约地址写入前端 config.json（写到 frontend/web/src/config.json）
  const frontendConfigDir = path.join(__dirname, "..", "frontend", "web", "src");
  if (!fs.existsSync(frontendConfigDir)) {
    console.warn("前端 src 目录不存在，跳过写入 config.json: ", frontendConfigDir);
    return;
  }

  const config = {
    network: rpc,
    contractAddress: deployedAddress,
    deployer: wallet.address
  };
  fs.writeFileSync(path.join(frontendConfigDir, "config.json"), JSON.stringify(config, null, 2));
  console.log("已写入前端配置: frontend/web/src/config.json");

  // 复制 ABI 文件到前端 (artifacts 路径可能随项目不同而不同)
  try {
    const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", "FHELottery.sol", "FHELottery.json");
    const targetAbiPath = path.join(frontendConfigDir, "abi");
    if (!fs.existsSync(targetAbiPath)) fs.mkdirSync(targetAbiPath, { recursive: true });
    fs.copyFileSync(artifactPath, path.join(targetAbiPath, "FHELottery.json"));
    console.log("已复制 ABI 到 frontend/web/src/abi/FHELottery.json");
  } catch (e) {
    console.warn("复制 ABI 失败，请手动从 artifacts/.../FHELottery.json 复制到 frontend/web/src/abi/FHELottery.json", e);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
