import { AppDataSource } from '../dataSource.js';
import { PageTransition } from '../entities/PageTransition.js';

const weightedTransitions: { [key: string]: string[] } = {
    home: ['profile', 'catalog', 'profile', 'profile', "login"],
    catalog: ['profile', 'home', "home"],
    profile: ['settings', 'create', 'settings', 'home', "catalog"],
    create: ['profile', 'catalog', 'catalog',],
    settings: ['home', 'profile', 'profile'],
    videoChat: ['profile', 'home'],
    login: ['home', 'home', 'profile'],

};

const pages = Object.keys(weightedTransitions);

function getRandomTo(from: string): string {
    const weightedOptions = weightedTransitions[from];
    return weightedOptions[Math.floor(Math.random() * weightedOptions.length)];
}

async function generateWeightedTransitions(count = 2000) {
    await AppDataSource.initialize();
    const repo = AppDataSource.getRepository(PageTransition);
    const data: PageTransition[] = [];

    for (let i = 0; i < count; i++) {
        const from = pages[Math.floor(Math.random() * pages.length)];
        const to = getRandomTo(from);

        const transition = repo.create({ from, to });
        data.push(transition);
    }

    await repo.save(data);
    console.log(`${count} weighted transitions inserted.`);
    await AppDataSource.destroy();
}

generateWeightedTransitions().catch(console.error);