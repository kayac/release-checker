const CONSOLE_GROUP_NAME = 'release-checker';

const testArr = [];

class ReleaseTest {
    constructor (opts) {
        this.name = opts.name;
        this.errorMessage = opts.errorMessage;
        this.validMessage = opts.validMessage;
        this.check = opts.check;
    }
}

console.group(CONSOLE_GROUP_NAME);

[
    new ReleaseTest({
        name: 'Google Analytics', 
        validMessage: 'Google Analyticsタグが読み込まれています',
        errorMessage: 'Google Analyticsタグが確認できません',
        check: new Promise((resolve, reject) => {
            const key = window.GoogleAnalyticsObject;

            if (key && !!window[key]) {
                resolve();
            } else {
                reject();
            }
        })
    }),
    new ReleaseTest({
        name: 'OGP Image', 
        validMessage: 'OGP画像が設定されています',
        errorMessage: 'OGP画像がありません',
        check: new Promise((resolve, reject) => {
            const meta = document.querySelector('meta[property="og:image"]');

            if (meta) {
                resolve();
            } else {
                reject();
            }
        })
    }),
    new ReleaseTest({
        name: 'Twitter Cards', 
        validMessage: 'Twitter cardsが設定されています',
        errorMessage: 'Twitter cardsがありません',
        check: new Promise((resolve, reject) => {
            const meta = document.querySelector('meta[property="twitter:image"]') || document.querySelector('meta[name="twitter:image"]');

            if (meta) {
                resolve();
            } else {
                reject();
            }
        })
    })
].forEach((test) => {
    const promise = new Promise((resolve) => {
        test.check
            .then((_res) => {
                resolve(test.validMessage);
            })
            .catch((_res) => {
                resolve(test.errorMessage);
            })
        ;
    });

    testArr.push(promise);
});

Promise.all(testArr)
    .then((resArr) => {
        resArr.forEach((res) => {
            console.log(res);
        });
    })
    .catch((err) => {
        console.log('エラーが発生しました:', err);
    })
    .then(() => {
        console.groupEnd(CONSOLE_GROUP_NAME);
    })
;
