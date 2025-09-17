// deploy/deploy.ts
import fs from "fs";
import path from "path";
import readline from "readline";
import { ethers as hardhatEthers } from "hardhat"; // 用于 getContractFactory
import { Wallet, JsonRpcProvider } from "ethers";

async function ask(prompt: string) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise<string>((res) =>
    rl.question(prompt, (ans) => { rl.close(); res(ans.trim()); })
  );
}

async function main() {
  const privateKey = await ask("请输入部署私钥（仅测试网）: ");
  let rpc = await ask("请输入 RPC URL（回车使用公共 Sepolia: https://sepolia.drpc.org）: ");
  if (!rpc) rpc = "https://sepolia.drpc.org";

  const provider = new JsonRpcProvider(rpc);
  const wallet = new Wallet(privateKey, provider);

  console.log("部署账户:", wallet.address);

  // 部署普通 Lottery 合约
  const LotteryFactory = await hardhatEthers.getContractFactory("Lottery", wallet);
  const lottery = await LotteryFactory.deploy();
  await lottery.waitForDeployment();

  const deployedAddress = lottery.target || (lottery as any).address;
  console.log("Lottery 部署成功，地址:", deployedAddress);

  // 写入前端配置
  const frontendConfigDir = path.join(__dirname, "..", "frontend", "web", "src");
  if (!fs.existsSync(frontendConfigDir)) {
    console.warn("前端 src 目录不存在，跳过写入 config.json: ", frontendConfigDir);
  } else {
    const config = {
      network: rpc,
      contractAddress: deployedAddress,
      deployer: wallet.address
    };
    fs.writeFileSync(path.join(frontendConfigDir, "config.json"), JSON.stringify(config, null, 2));
    console.log("已写入前端配置: frontend/web/src/config.json");

    // 复制 ABI 文件到前端
    try {
      const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", "Lottery.sol", "Lottery.json");
      const targetAbiPath = path.join(frontendConfigDir, "abi");
      if (!fs.existsSync(targetAbiPath)) fs.mkdirSync(targetAbiPath, { recursive: true });
      fs.copyFileSync(artifactPath, path.join(targetAbiPath, "Lottery.json"));
      console.log("已复制 ABI 到 frontend/web/src/abi/Lottery.json");
    } catch (e) {
      console.warn("复制 ABI 失败，请手动从 artifacts/.../Lottery.json 复制到 frontend/web/src/abi/Lottery.json", e);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
