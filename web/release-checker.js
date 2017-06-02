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
        check: () => {
            var key = window.GoogleAnalyticsObject;
            return key && !!window[key];
        }
    }),
    new ReleaseTest({
        name: 'OGP Image', 
        validMessage: 'OGP画像が設定されています',
        errorMessage: 'OGP画像がありません',
        check: () => {
            return new Promise((resolve, reject) => {
                const meta = document.querySelector('meta[property="og:image"]');

                if (meta) {
                    resolve();
                } else {
                    reject();
                }
            });
        }
    }),
    new ReleaseTest({
        name: 'Twitter Cards', 
        validMessage: 'Twitter cardsが設定されています',
        errorMessage: 'Twitter cardsがありません',
        check: (cb) => {
            var meta = document.querySelector('meta[property="twitter:image"]') || document.querySelector('meta[name="twitter:image"]');
            return meta;
        }
    })
].forEach((test) => {
    const check = test.check();

    if (check instanceof Promise) {
        const promise = new Promise((resolve) => {
            check
                .then((_res) => {
                    resolve(test.validMessage);
                })
                .catch((_res) => {
                    resolve(test.errorMessage);
                })
            ;
        });

        testArr.push(promise);
    } else {
        const result = check;

        const promise = new Promise((resolve) => {
            if (result) {
                resolve(test.validMessage);
            } else {
                resolve(test.errorMessage);
            }
        });

        testArr.push(promise);
    }
});

Promise.all(testArr)
    .then((resArr) => {
        resArr.forEach((res) => {
            console.log(res);
        });
        console.groupEnd(CONSOLE_GROUP_NAME);
    })
    .catch((err) => {
        console.log('エラーが発生しました:', err);
        console.groupEnd(CONSOLE_GROUP_NAME);
    });
;
