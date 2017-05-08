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
        check: (db) => {
            var all_html = document.getElementsByTagName('html')[0].childNodes;
            var comment_array = [];
            var check_state = [];
            // nodeを入れるとfilter掛けてコメント抽出してくれる君(nodeList -> Array)
            var is_comment = (_node) => {
                var this_node = _node;
                if (this_node.nodeType === Node.COMMENT_NODE) {
                    comment_array.push(this_node.data);
                }
                return comment_array;
            };

            // 再帰してノード総ナメしてくれる君
            var recursive = (_node) => {
                // ノード取得
                var current_node = _node;
                // 子ノードがあるか判定
                for (var i = 0; i < current_node.length; i++) {
                    if (!current_node[i].hasChildNodes()) {
                        is_comment(current_node[i]);
                    } else {
                        recursive(current_node[i].childNodes);
                    }
                }
            };
            
            // TODOってワードが含まれているか見つける君
            var check_word = (_target) => {
                var this_word = _target;
                var ng_word   = ["TODO", "todo"];
                for (key in ng_word) {
                    if (this_word.indexOf(ng_word[key]) != -1) {
                    // 含んでいる場合
                        return false;
                    }
                }
                return true;
            }
            var get_comment = recursive(all_html);
            var meta = comment_array.every(check_word);
            return meta
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
