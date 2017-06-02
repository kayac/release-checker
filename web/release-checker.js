const CONSOLE_GROUP_NAME = 'release-checker';

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
                var meta = document.querySelector('meta[property="og:image"]');

                if (false) {
                    resolve(200);
                } else {
                    reject(500);
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
        check
            .then((res) => {
                console.log(res);
            })
            .catch((res) => {
                console.log(res);
            })
        ;
    } else {
        const res = check;

        if (res) {
            console.log(test.validMessage);
        } else {
            console.error(test.errorMessage);
        }
    }
});

console.groupEnd(CONSOLE_GROUP_NAME);
