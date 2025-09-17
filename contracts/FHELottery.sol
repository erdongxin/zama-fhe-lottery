// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, ebool, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title FHE Lottery
/// @notice 购票号码以 FHE 加密形式存储；管理员揭示明文中奖号码后合约判定中奖名单
contract FHELottery is SepoliaConfig {
    struct Ticket {
        address buyer;
        euint32 number;
    }

    struct LotteryRound {
        string name;
        uint256 drawTime;
        bool drawn;
        euint32 winningNumber;
        Ticket[] tickets;
        address[] winners;
    }

    LotteryRound[] public rounds;
    address public admin;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /// @notice 创建新一期（tickets / winners 默认是空数组，无需显式初始化）
    function createRound(string calldata name, uint256 drawTime) external onlyAdmin {
        require(drawTime > block.timestamp, "Draw time must be in future");

        // push 一个空的 element，然后逐字段赋值（避免在字面量中初始化动态数组）
        rounds.push();
        LotteryRound storage r = rounds[rounds.length - 1];
        r.name = name;
        r.drawTime = drawTime;
        r.drawn = false;
        r.winningNumber = FHE.asEuint32(0);
        // r.tickets 和 r.winners 使用默认空数组
    }

    /// @notice 购票：传入 externalEuint32（前端生成）和 proof
    function buyTicket(uint256 roundId, externalEuint32 number, bytes memory proof) external {
        require(roundId < rounds.length, "Round not exist");
        LotteryRound storage round = rounds[roundId];
        require(!round.drawn, "Already drawn");
        require(block.timestamp < round.drawTime, "Round closed");

        // 把外部密文 + proof 转成合约内部加密类型
        euint32 cipherNumber = FHE.fromExternal(number, proof);

        round.tickets.push(Ticket({
            buyer: msg.sender,
            number: cipherNumber
        }));

        // 授权买家和合约本身查看该密文（按需）
        FHE.allow(cipherNumber, msg.sender);
        FHE.allowThis(cipherNumber);
    }

    /// @notice 管理员开奖（传入明文中奖号码），合约将以 FHE 方式比较每张票
    function draw(uint256 roundId, uint32 plainWinningNumber) external onlyAdmin {
        require(roundId < rounds.length, "Round not exist");
        LotteryRound storage round = rounds[roundId];
        require(!round.drawn, "Already drawn");
        require(block.timestamp >= round.drawTime, "Cannot draw before draw time");

        // 把明文转为 FHE 密文表示并存储
        euint32 winningCipher = FHE.asEuint32(plainWinningNumber);
        round.winningNumber = winningCipher;

        // 对每张票用 FHE.eq 比较（返回 ebool）
        for (uint256 i = 0; i < round.tickets.length; i++) {
            ebool isWinner = FHE.eq(round.tickets[i].number, winningCipher);
            // 用类型的 unwrap 检查是否不为 0
            // （不同版本的库 unwrap 返回可以比较的底层数值）
            if (ebool.unwrap(isWinner) != 0) {
                round.winners.push(round.tickets[i].buyer);
            }
        }

        round.drawn = true;
    }

    /// @notice 返回期信息（若未开奖，winningNumber 返回 0）
    function getRound(uint256 roundId) external view returns (
        string memory name,
        uint32 winningNumber,
        uint256 drawTime,
        bool drawn,
        uint256 ticketCount,
        uint256 winnerCount
    ) {
        require(roundId < rounds.length, "Round not exist");
        LotteryRound storage round = rounds[roundId];

        uint32 winNum = 0;
        if (round.drawn) {
            // euint32.unwrap 返回底层数值，先转 uint256 再 cast 成 uint32
            winNum = uint32(uint256(euint32.unwrap(round.winningNumber)));
        }

        return (
            round.name,
            winNum,
            round.drawTime,
            round.drawn,
            round.tickets.length,
            round.winners.length
        );
    }

    /// @notice 仅开奖后可查看中奖名单
    function getWinners(uint256 roundId) external view returns (address[] memory) {
        require(roundId < rounds.length, "Round not exist");
        LotteryRound storage round = rounds[roundId];
        require(round.drawn, "Winners visible only after draw");
        return round.winners;
    }

    /// @notice 获取长度
    function roundsCount() external view returns (uint256) {
        return rounds.length;
    }
}
