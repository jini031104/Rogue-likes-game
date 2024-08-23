import chalk from 'chalk';
import readlineSync from 'readline-sync';

function sleep(ms) {
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) {}
}

class Player {
  constructor(isRun) {
    this._isRun = isRun;
    this.hp = 100;
    this.attack = 5;
  }

  Attack(logs) {
    // 플레이어의 공격
    logs.push(chalk.green(`플레이어의 공격! ${this.attack}의 피해를 입혔다!`));
  }

  Run(logs) {
    logs.push(chalk.blue(`플레이어는 도망갔다.`));
    this._isRun = true;
  }

  Damage(logs, monsterAttack) {
    logs.push(chalk.red(`플레이어는 ${monsterAttack} 만큼 HP가 깎였다.`));
    this.hp -= monsterAttack;
  }

  set setRun(run) {
    this._isRun = run;
  }
  get getRun() {
    return this._isRun;
  }
}

class Monster {
  constructor(stage) {
    this.hp = 15 + ((stage - 1) * 5);
    this.attack = 5;
  }

  Attack(logs) {
    // 몬스터의 공격
    logs.push(chalk.red(`몬스터의 공격! ${this.attack}의 피해를 입었다!`));
  }

  Damage(logs, playerAttack) {
    logs.push(chalk.green(`몬스터는 ${playerAttack} 만큼 HP가 깎였다.`));
    this.hp -= playerAttack;

    if(this.hp <= 0)
        logs.push(chalk.blue(`\n몬스터가 사망했다!`));
  }
}

function displayStatus(stage, player, monster) {
  console.clear();
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
    chalk.blueBright(`| 플레이어 정보 - HP: ${player.hp} ATTACK: ${player.attack} `) +
    chalk.redBright(`| 몬스터 정보 - HP: ${monster.hp} ATTACK: ${monster.attack} |`)
  );
  console.log(chalk.magentaBright(`=====================\n`));
}


function handleUserInputGame(logs, player, monster) {
    const choice = readlineSync.question('당신의 선택은? ');
    logs.push(chalk.green(`${choice}를 선택하셨습니다.`));

    switch (choice) {
        case '1':
            player.Attack(logs);
            monster.Damage(logs, player.attack);
            if(0 < monster.hp) {
                monster.Attack(logs);
                player.Damage(logs, monster.attack);
            }
            break;
        case '2':
            player.Run(logs);
            break;
        case '`': // 개발자 키
            console.log(chalk.red('게임을 종료합니다.'));
            process.exit(0); // 게임 종료
            break;
        default:
            console.log(chalk.red('올바른 선택을 하세요.'));
            handleUserInputGame(logs, player, monster);
    }
}

// 몬스터 행동 지문
function MonsterAtion(num) {
    var AtionStr = ['몬스터와 마주쳤다!',
        '몬스터는 화가 나 보인다.',
        '몬스터가 위협적으로 포효했다.',
        '몬스터는 당신을 노려보고 있다.',
        '몬스터는 공격할 틈을 보고 있는 것 같다.'
       ]
    console.log(chalk.green('\n' + AtionStr[num]));
}
const battle = async (stage, player, monster) => {
  let logs = [];
  let count = 0, monsterAtionNum = 0;

  while(player.hp > 0) {
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    if(player.hp <= 0 || monster.hp <= 0 || player.getRun == true) {
      console.log(chalk.yellow(`\n다음 스테이지 준비 중...`));
      sleep(3000);
      break;
    }
    
    // 몬스터 행동 지문 출력
    count === 0 ? count = 1 : monsterAtionNum = Math.floor(1 + Math.random() * 4);
    MonsterAtion(monsterAtionNum);
    console.log(chalk.green(`\n1. 공격 2. 도망.`));

    // 플레이어의 선택에 따라 다음 행동 처리
    handleUserInputGame(logs, player, monster);
  }

  // 플레이어 사망
  if(player.hp <= 0) {
    displayStatus(stage, player, monster);
    logs.forEach((log) => console.log(log));
    console.log(chalk.red(`\n플레이어는 사망했다...`));
    sleep(3000);
  }
};

export async function startGame() {
  console.clear();
  const player = new Player(false);
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(stage);
    player.setRun = false;
    await battle(stage, player, monster);

    // 스테이지 클리어 및 게임 종료 조건
    if(player.hp <= 0)
      break;

    stage++;
  }
}