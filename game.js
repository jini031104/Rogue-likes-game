import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { sleep, getRandom, MonsterAtion, displayStatus } from "./functionTest.js";

class Player {
    constructor() {
        let eventSelect = -1;
        let recovery = 0;
        let minAttackUP = 0;
        let maxAttackUP = 0;
        let successUP = 0;  // 확률UP 변수
        let maxHP = 100;    // 최대 체력 | 절대 고정!! = 절대 접근 금지
        this._hp = maxHP;   // 현재 체력
        this.minAttack = 3; // 최소 공격력
        this.maxAttack = 5; // 최대 공격력
        this._attack = 0;   // 공격 = 피해력
        this._dubbleAttackSuccess = 25; // 더블 공격 성공률
        this._runSuccess = 40;      // 도망 성공률
        this._defenceSuccess = 30;  // 방어 성공률
        this._isRun = false;

        this.getEventSelect = function () {
            return eventSelect;
        }
        this.getMaxHP = function () {   // 최대 체력 출력할 때만 쓰임
            return maxHP;
        };
        this.getRecovery = function () {
            return recovery;
        };
        this.getMinAttackUP = function () {
            return minAttackUP;
        }
        this.getMaxAttackUP = function () {
            return maxAttackUP;
        }
        this.getSuccessUP = function () {
            return successUP;
        }
        this.setRecovery = function (n) {
            recovery = n;
        }
        this.setEventSelect = function (n) {
            eventSelect = n;
        }
        this.setMinAttackUP = function (n) {
            minAttackUP = n;
        }
        this.setMaxAttackUP = function (n) {
            maxAttackUP = n;
        }
        this.setSuccessUP = function (n) {
            successUP = n;
        }
    }
    Attack(logs) {
        // 플레이어의 공격 | 최소 ~ 최대 사이의 공격을 가한다.
        this._attack = getRandom(this.minAttack, this.maxAttack);
        logs.push(chalk.green(`플레이어의 공격! ${this.attack}의 피해를 입혔다!`));
    }

    DubbleAttack(logs) {
        let attackSuccess = getRandom(0, 99); // 0 ~ 99
        let dublleAttack = 0;
        if (attackSuccess <= this._dubbleAttackSuccess) {
            logs.push(chalk.yellow(`플레이어의 연속 공격!!`));
            for (let i = 0; i < 2; i++) {
                this._attack = getRandom(this.minAttack, this.maxAttack);
                logs.push(chalk.green(`${this._attack}의 피해를 입혔다!`));
                dublleAttack += this._attack;
            }
            logs.push(chalk.yellow(`총 ${dublleAttack}의 피해를 입혔다!`) +
                chalk.blue(`\n강한 공격에 몬스터는 공격할 정신이 없는 것 같다.`));
        } else {
            logs.push(chalk.green(`연속 공격 실패...`) +
                chalk.red(`\n몬스터는 무척 화가 나 보인다!!`));
        }

        return dublleAttack;
    }

    Damage(logs, monsterAttack) {
        logs.push(chalk.red(`플레이어는 ${monsterAttack} 만큼 HP가 깎였다.`));
        this._hp -= monsterAttack;
    }

    Defence(logs) {
        let Success = getRandom(0, 99); // 0 ~ 99
        let isSuccess = false;
        if(Success <= this._defenceSuccess) {
            logs.push(chalk.yellow(`방어 성공!!\n몬스터는 빈틈을 보였다!`));
            isSuccess = true;
        } else {
            logs.push(chalk.green(`방어 실패...`));
        }

        return isSuccess;
    }

    Run(logs) {
        let runSuccess = getRandom(0, 99); // 0 ~ 99
        if(runSuccess < this._runSuccess) {
            logs.push(chalk.blue(`플레이어는 도망갔다.`));
            this._isRun = true;    
        } else {
            logs.push(chalk.red(`도망갈 틈이 보이지 않는다.\n플레이어는 도망치지 못했다!`));
            this._isRun = false;
        }
    }

    NextStageEvent() {
        let eventSelect = getRandom(0, 4);
        let success = 0;
        this.setEventSelect(eventSelect);
        switch (eventSelect) {
            case 0: // 체력 UP
                if (0 < this._hp) {
                    this.setRecovery(getRandom(20, 50));  // 회복은 20 ~ 50
                    let recovery = this.getRecovery();
                    this._hp += this._hp < this.getMaxHP() ? recovery : 0;
                    if (this.getMaxHP() <= this.hp) { // 그러나 최대HP를 넘길경우 그 이상은 버려진다.
                        recovery -= (this._hp === this.getMaxHP() ? recovery : this._hp - this.getMaxHP());
                        this._hp = this.getMaxHP();
                        this.setRecovery(recovery);
                    }
                }
                break;
            case 1: // 공격력 UP
                this.setMinAttackUP(getRandom(5, 20));
                this.minAttack += this.getMinAttackUP(); // 최소 공격력: 5 ~ 20 증가
                this.setMaxAttackUP(this.getMinAttackUP() + 3 + getRandom(0, 5));
                this.maxAttack += this.getMaxAttackUP();  // 최대 공격력: 최소공격력 + 3 + 0 ~ 5 증가
                break;
            case 2: // 연속 공격 성공 확률 UP
                success = getRandom(3, 7);
                this.setSuccessUP(success);
                this._dubbleAttackSuccess += success;
                break;
            case 3: // 방어 성공 확률 UP
                success = getRandom(3, 10);
                this.setSuccessUP(success);
                this._defenceSuccess += success;
                break;
            case 4: // 도망 성공 확률 UP
                success = getRandom(3, 10);
                this.setSuccessUP(success);
                this._runSuccess += success;
                break;
        }
    }

    get hp() {
        return this._hp;
    }
    get attack() {
        return this._attack;
    }
    get dubbleAttackSuccess() {
        return this._dubbleAttackSuccess;
    }
    get defenceSuccess() {
        return this._defenceSuccess;
    }
    get isRun() {
        return this._isRun;
    }
    get runSuccess() {
        return this._runSuccess;
    }

    set isRun(run) {
        this._isRun = run;
    }
    set dubbleAttackSuccess(success) {
        this._dubbleAttackSuccess = success;
    }
}

class Monster {
    constructor(stage) {
        this._hp = 10 + ((stage - 1) * 10);
        let attack = 10 + ((stage - 1) * 5);

        this.getAttack = function () {
            return attack;
        }
    }

    Attack(logs) {
        // 몬스터의 공격
        logs.push(chalk.green(`몬스터의 공격! ${this.getAttack()}의 피해를 입었다!`));
    }

    Damage(logs, playerAttack) {
        logs.push(chalk.green(`몬스터는 ${playerAttack} 만큼 HP가 깎였다.`));
        this._hp -= playerAttack;

        if (this._hp <= 0)
            logs.push(chalk.blue(`\n몬스터가 사망했다!`));
    }

    get hp() {
        return this._hp;
    }
}

function handleUserInputGame(logs, player, monster) {
    const choice = readlineSync.question('당신의 선택은? ');
    logs.push(chalk.green(`\n${choice}를 선택하셨습니다.`));
    switch (choice) {
        case '1':   // 공격
            player.Attack(logs);
            monster.Damage(logs, player.attack);
            if (0 < monster.hp) {
                monster.Attack(logs);
                player.Damage(logs, monster.getAttack());
            }
            break;
        case '2':   // 연속 공격
            let damage = player.DubbleAttack(logs);
            if (damage != 0)
                monster.Damage(logs, damage);
            else {
                monster.Attack(logs);
                player.Damage(logs, monster.getAttack());
            }
            break;
        case '3':   // 방어
            let success = player.Defence(logs);
            if(success) {
                player.Attack(logs);
                monster.Damage(logs, player.attack * 0.6);
                logs.push(chalk.yellow(`공격이 조금 빗나가 치명상은 피한 것 같다.`));
            } else {
                monster.Attack(logs);
                player.Damage(logs, monster.getAttack());
            }
            break;
        case '4':   // 도망
            player.Run(logs);
            if(player.isRun == false) {
                monster.Attack(logs);
                player.Damage(logs, monster.getAttack());
            }
            break;
        case '`':   // 개발자 키
            console.log(chalk.red('게임을 종료합니다.'));
            process.exit(0); // 게임 종료
            break;
        default:
            console.log(chalk.red(`올바른 선택을 하세요`));
            handleUserInputGame(logs, player, monster);
    }
}

const battle = async (stage, player, monster) => {
    let logs = [];
    let count = 0, monsterAtionNum = 0;
    if (1 < stage) {
        switch (player.getEventSelect()) {
            case 0: // 체력 UP
                logs.push(chalk.blue(`\nHP가 ${player.getRecovery()} 만큼 회복됐다!`));
                break;
            case 1: // 공격력 UP
                logs.push(chalk.blue(`\n최소 공격력이 ${player.getMinAttackUP()} 만큼 증가했다!`));
                logs.push(chalk.blue(`최대 공격력이 ${player.getMaxAttackUP()} 만큼 증가했다!`));
                break;
            case 2: // 연속 공격 성공 확률 UP
                logs.push(chalk.blue(`\n연속 공격 확률이 ${player.getSuccessUP()} 만큼 증가했다!`));
                break;
            case 3: // 방어 성공 확률 UP
                logs.push(chalk.blue(`\n방어 성공 확률이 ${player.getSuccessUP()} 만큼 증가했다!`));
                break;
            case 4: // 도망 성공 확률 UP
                logs.push(chalk.blue(`\n도망 성공 확률이 ${player.getSuccessUP()} 만큼 증가했다!`));
                break;
        }
    }

    while (player.hp > 0) {
        displayStatus(stage, player, monster);
        logs.forEach((log) => console.log(log));

        if (monster.hp <= 0 || player.isRun == true) {
            console.log(chalk.yellow(`\n다음 스테이지 준비 중...`));
            sleep(3000);
            break;
        }

        count === 0 ? count = 1 : monsterAtionNum = getRandom(1, 4);
        MonsterAtion(monsterAtionNum);
        console.log(chalk.green(`\n1. 공격한다 2. 연속 공격(${player.dubbleAttackSuccess}%) 3. 방어(${player.defenceSuccess}%) 4. 도망(${player.runSuccess}%)`));

        handleUserInputGame(logs, player, monster);
    }

    // 플레이어 사망
    if (player._hp <= 0) {
        displayStatus(stage, player, monster);
        logs.forEach((log) => console.log(log));
        console.log(chalk.red(`\n플레이어는 쓰러졌다...`));
    } else {
        player.NextStageEvent();
    }
};

export async function startGame() {
    console.clear();
    const player = new Player();
    let stage = 1;

    while (stage <= 10) {
        const monster = new Monster(stage);
        player.isRun = false;
        await battle(stage, player, monster);

        // 스테이지 클리어 및 게임 종료 조건
        if (player.hp <= 0)
            break;

        stage++;
    }
}