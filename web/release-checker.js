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
            return new Promise((resolve, reject) => {
                const key = window.GoogleAnalyticsObject;

                if (key && !!window[key]) {
                    resolve();
                } else {
                    reject();
                }
            });
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
        check: () => {
            return new Promise((resolve, reject) => {
                const meta = document.querySelector('meta[property="twitter:image"]') || document.querySelector('meta[name="twitter:image"]');

                if (meta) {
                    resolve();
                } else {
                    reject();
                }
            });
        }
    }),
    new ReleaseTest({
        name: 'TODO Check',
        validMessage: 'TODO残っていません',
        errorMessage: 'TODOが記述されています',
        check: (cb) => {
            var allHtml = document.getElementsByTagName('html')[0].childNodes;
            // nodeを入れるとfilter掛けてコメント抽出してくれる君。保存先はterget(nodeList -> Array)
            var pickComment = (_node, _target) => {
                if (_node.nodeType === Node.COMMENT_NODE) {
                    _target.push(_node.data);
                }
            };
            var findCommentNode = (_nodeList) => {
                var commentArray = [];
                for (var i = 0; i < _nodeList.length; i++) {
                    if(!_nodeList[i].hasChildNodes()) {
                        pickComment(_nodeList[i], commentArray);
                    } else {
                        // childNode持ってたらchildNodeをつなげた新しい配列を代入して再帰
                        commentArray = commentArray.concat(findCommentNode(_nodeList[i].childNodes));
                    }
                }
                return commentArray;
            };
            // TODOってワードが含まれているか見つける君
            var checkWord = (_target) => {
                var ngWord = ["TODO", "todo"];
                return ngWord.every((word) => {
                    // 含まれていなかったら-1を返す
                    return _target.indexOf(word) < 0;
                });
            };
            // 全てのコメントを引っ張ってきた配列から"TODO"ってワードが含まれているか探す。
            return findCommentNode(allHtml).every(checkWord);
        }
    })
].forEach((test) => {
    const promise = new Promise((resolve) => {
        test.check()
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
