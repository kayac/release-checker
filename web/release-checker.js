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
        check: (cb) => {
            var meta = document.querySelector('meta[property="og:image"]');
            return meta;
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
    }),
    new ReleaseTest({
        name: 'TODO Check',
        validMessage: 'TODO残っていません',
        errorMessage: 'TODOが記述されています',
        check: (cb) => {
            var allHtml = document.getElementsByTagName('html')[0].childNodes;
            var commentArray = [];
            // nodeを入れるとfilter掛けてコメント抽出してくれる君(nodeList -> Array)
            var pickComment = (_node) => {
                if (_node.nodeType === Node.COMMENT_NODE) {
                    commentArray.push(_node.data);
                }
            };
            // 再帰してノード総ナメして吐き出してくれる君
            var findCommentNode = (_node) => {
                // 子ノードがあるか判定
                for (var i = 0; i <  _node.length; i++) {
                    if (!_node[i].hasChildNodes()) {
                        pickComment(_node[i]);
                    } else {
                        findCommentNode(_node[i].childNodes);
                    }
                }
                //見つけたやつを吐き出す
                return commentArray;
            };
            // var findCommentNode = (_node) => {
            //     var commentArray = [];
                
            //     if(!_node[1].hasChildNodes()) {
            //         console.log(_node);
            //         pickComment(_node);
            //     } else {
            //         // 配列をつなげて新しい配列を代入する
            //         commentArray = commentArray.concat(findCommentNode(`こども`));
            //     }
            //     return commentArray;
            // }
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
    if (test.check()) {
        console.log(test.validMessage);
    } else {
        console.error(test.errorMessage);
    }
});

console.groupEnd(CONSOLE_GROUP_NAME);
