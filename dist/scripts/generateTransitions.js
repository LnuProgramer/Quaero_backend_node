var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AppDataSource } from '../dataSource.js';
import { PageTransition } from '../entities/PageTransition.js';
const weightedTransitions = {
    home: ['profile', 'catalog', 'profile', 'profile', "login"],
    catalog: ['profile', 'home', "home"],
    profile: ['settings', 'create', 'settings', 'home', "catalog"],
    create: ['profile', 'home'],
    settings: ['home', 'profile'],
    videoChat: ['profile', 'home'],
    login: ['home', 'home', 'profile'],
};
const pages = Object.keys(weightedTransitions);
function getRandomTo(from) {
    const weightedOptions = weightedTransitions[from];
    return weightedOptions[Math.floor(Math.random() * weightedOptions.length)];
}
function generateWeightedTransitions() {
    return __awaiter(this, arguments, void 0, function* (count = 2000) {
        yield AppDataSource.initialize();
        const repo = AppDataSource.getRepository(PageTransition);
        const data = [];
        for (let i = 0; i < count; i++) {
            const from = pages[Math.floor(Math.random() * pages.length)];
            const to = getRandomTo(from);
            const transition = repo.create({ from, to });
            data.push(transition);
        }
        yield repo.save(data);
        console.log(`${count} weighted transitions inserted.`);
        yield AppDataSource.destroy();
    });
}
generateWeightedTransitions().catch(console.error);
//# sourceMappingURL=generateTransitions.js.map