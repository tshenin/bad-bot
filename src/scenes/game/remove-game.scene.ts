import {Scenes, Telegraf} from "telegraf";
import { removeGame} from "../../services/games.service.js";
import { renderYesNoButtons} from "../../markup/buttons.js";

export const removeGameSceneRun = () => {
    const removeGamesScene = new Scenes.BaseScene<Scenes.SceneContext>('remove_game');

    let gameId: string;

    removeGamesScene.enter(async (ctx) => {
        gameId = ctx.scene.state['game'];

        ctx.reply('Удалить игру?', {
            parse_mode: 'HTML',
            ...renderYesNoButtons(['Подтвердить', 'Отмена'],'remove_btn__' ),
        });
    });

    removeGamesScene.action(/remove_btn__(.+)/, async (ctx) => {
        if (ctx.match.at(1) === 'yes') {

            try {
                await removeGame(gameId);
                ctx.reply('Игра удалена');
            }
            catch (e) {
                ctx.reply('Что-то пошло не так, попробуйте позже');
            }

        }

        await ctx.answerCbQuery();
        await ctx.scene.leave();
    });

    return removeGamesScene;
};

export const setRemoveGameSceneListener = (
    bot: Telegraf<Scenes.SceneContext>,
): void => {
    bot.action(/remove_game__(.+)/, (ctx) => ctx.scene.enter('remove_game',  { game: ctx.match[1] }));
};
