const CONSOLE_GROUP_NAME = 'release-checker';

class ReleaseTest {
    constructor (opts) {
        this.name = opts.name;
        this.errorMessage = opts.errorMessage;
        this.validMessage = opts.validMessage;
        this.checker = opts.checker;
    }
}

console.group(CONSOLE_GROUP_NAME);

[
    new ReleaseTest({
        name: 'Google Analytics', 
        validMessage: 'Google Analyticsタグが読み込まれています',
        errorMessage: 'Google Analyticsタグが確認できません',
        checker: () => {
            var key = window.GoogleAnalyticsObject;
            return key && !!window[key];
        }
    }),
    new ReleaseTest({
        name: 'og:image', 
        validMessage: 'OGP画像が設定されています',
        errorMessage: 'OGP画像がありません',
        checker: (cb) => {
            var meta = document.querySelector('meta[property="og:image"]');
            return meta;
        }
    })
].forEach((test) => {
    if (test.checker()) {
        console.log(test.validMessage);
    } else {
        console.error(test.errorMessage);
    }
});

console.groupEnd(CONSOLE_GROUP_NAME);
