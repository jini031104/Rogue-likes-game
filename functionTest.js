import chalk from 'chalk';

export function sleep(ms) {
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) { }
}

export function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function MonsterAtion(num) {
    var AtionStr = ['몬스터와 마주쳤다!',
        '몬스터는 화가 나 보인다.',
        '몬스터가 위협적으로 포효했다.',
        '몬스터는 당신을 노려보고 있다.',
        '몬스터는 공격할 틈을 보고 있는 것 같다.'
    ]
    console.log(chalk.green('\n' + AtionStr[num]));
}

export function displayStatus(stage, player, monster) {
    console.clear();
    console.log(chalk.magentaBright(`\n=== Current Status ===`));
    console.log(
        chalk.cyanBright(`| Stage: ${stage} `) +
        chalk.blueBright(`| 플레이어 정보 - HP: ${player.getMaxHP()}/${player.hp} ATTACK: ${player.minAttack}~${player.maxAttack} `) +
        chalk.redBright(`| 몬스터 정보 - HP: ${monster.hp} ATTACK: ${monster.getAttack()} |`)
    );
    console.log(chalk.magentaBright(`=====================\n`));
}