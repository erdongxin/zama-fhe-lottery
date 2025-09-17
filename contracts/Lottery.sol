// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title 普通彩票合约示例（无 FHE）
contract Lottery {
    struct Ticket {
        address buyer;
        uint32 number; // 直接存明文
    }

    struct LotteryRound {
        string name;
        uint256 drawTime;
        bool drawn;
        uint32 winningNumber;
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

    /// @notice 创建新一期
    function createRound(string calldata name, uint256 drawTime) external onlyAdmin {
        require(drawTime > block.timestamp, "Draw time must be in future");
        rounds.push();
        LotteryRound storage r = rounds[rounds.length - 1];
        r.name = name;
        r.drawTime = drawTime;
        r.drawn = false;
        r.winningNumber = 0;
    }

    /// @notice 购票
    function buyTicket(uint256 roundId, uint32 number) external {
        require(roundId < rounds.length, "Round not exist");
        LotteryRound storage round = rounds[roundId];
        require(!round.drawn, "Already drawn");
        require(block.timestamp < round.drawTime, "Round closed");

        round.tickets.push(Ticket({
            buyer: msg.sender,
            number: number
        }));
    }

    /// @notice 管理员开奖
    function draw(uint256 roundId, uint32 winningNumber) external onlyAdmin {
        require(roundId < rounds.length, "Round not exist");
        LotteryRound storage round = rounds[roundId];
        require(!round.drawn, "Already drawn");
        require(block.timestamp >= round.drawTime, "Cannot draw before draw time");

        round.winningNumber = winningNumber;

        for (uint256 i = 0; i < round.tickets.length; i++) {
            if (round.tickets[i].number == winningNumber) {
                round.winners.push(round.tickets[i].buyer);
            }
        }

        round.drawn = true;
    }

    /// @notice 获取期信息
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
        return (
            round.name,
            round.winningNumber,
            round.drawTime,
            round.drawn,
            round.tickets.length,
            round.winners.length
        );
    }

    /// @notice 获取中奖名单
    function getWinners(uint256 roundId) external view returns (address[] memory) {
        require(roundId < rounds.length, "Round not exist");
        LotteryRound storage round = rounds[roundId];
        require(round.drawn, "Winners visible only after draw");
        return round.winners;
    }

    /// @notice 获取期数
    function roundsCount() external view returns (uint256) {
        return rounds.length;
    }
}