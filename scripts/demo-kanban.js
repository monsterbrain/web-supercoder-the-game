
var columnGrids = [];

document.addEventListener('DOMContentLoaded', function () {

    var docElem = document.documentElement;
    var kanban = document.querySelector('.kanban-demo');
    var board = kanban.querySelector('.board');
    generateCodes(board);
    var itemContainers = Array.prototype.slice.call(kanban.querySelectorAll('.board-column-content'));

    var dragCounter = 0;
    var boardGrid;



    itemContainers.forEach(function (container) {

        var muuri = new Muuri(container, {
                items: '.board-item',
                layoutDuration: 400,
                layoutEasing: 'ease',
                dragEnabled: true,

                //      dragSort: function () {
                //        return columnGrids;
                //      },
                //      var grid = new Muuri(elem, {
                //  dragAxis: 'y'
                //}),
                dragSortInterval: 0,
                dragContainer: document.body,
                dragReleaseDuration: 200,
                dragReleaseEasing: 'ease'
            })
            .on('dragStart', function (item) {
                ++dragCounter;
                docElem.classList.add('dragging');
                item.getElement().style.width = item.getWidth() + 'px';
                item.getElement().style.height = item.getHeight() + 'px';
            })
            .on('dragEnd', function (item) {
                if (--dragCounter < 1) {
                    docElem.classList.remove('dragging');
                }
            })
            .on('dragReleaseEnd', function (item) {
                item.getElement().style.width = '';
                item.getElement().style.height = '';
                columnGrids.forEach(function (muuri) {
                    muuri.refreshItems();
                });
            })
            .on('layoutStart', function () {
                boardGrid.refreshItems().layout();
            });

        columnGrids.push(muuri);

    });

    boardGrid = new Muuri(board, {
        layoutDuration: 400,
        layoutEasing: 'ease',
        //dragEnabled: true,
        dragSortInterval: 0,
        dragStartPredicate: {
            handle: '.board-column-header'
        },
        //    var grid = new Muuri(elem, {
        //  dragAxis: 'y'
        //});
        dragReleaseDuration: 400,
        dragReleaseEasing: 'ease'
    });
    //  var positioningItems = grid.getItems().filter(function (item) {
    //  return item.isPositioning();

});

function generateCodes(board) {
    //var arr= [1,2,3,4,5,6,7,8];
    
    const tab = '&nbsp; &nbsp; &nbsp; ';
    const codes = [
	  ['<h1>', tab + 'Title made with HTML', '</h1>', '<hr>', '<p>', tab + 'And I am Subtitle.', '</p>', '<button>', tab + 'Hide the text above', '</button>', '<br/>', '<h2>Click</h2>'], // html
	  ['body {', '	text-align: center;', '	padding: 3rem;', '}', 'h1, h2 {', '	font-size: 2rem;', '}', 'p {', '	margin-bottom: 2rem;', '	color: tomato;', '}', 'button {', '	padding: 0.75rem 2rem;', '}'], // css
	  ['var clickFn = function (){', '	$(\'p\').css(\'opacity\', 0);', '};', '$(\'button\').click(clickFn);']
    ];

    for (var i = 0; i < codes.length; i++) {
        var codeArray = codes[i];
        for (var j = 0; j < codeArray.length; j++) {
            var codeToAdd = codeArray[j];
            codeToAdd = codeToAdd.replace(/</g, '&lt;');
            codeToAdd = codeToAdd.replace(/>/g, '&gt;');

            var addClass = '';
            if (codeToAdd.indexOf('&lt;') != -1) {
                addClass += 'cm-tag'
            }

            if (i == 0) {
                $('.todo>.board-column-content').append('<div class="board-item" data-id="'+j+'"><div class="board-item-content"><span class="' + addClass + '">' + codeToAdd + '</span></div></div>');
            } else if (i == 1) {
                $('.working>.board-column-content').append('<div class="board-item" data-id="'+j+'"><div class="board-item-content"><span>' + codeToAdd + '</span></div></div>');
            } else if (i == 2) {
                $('.done>.board-column-content').append('<div class="board-item" data-id="'+j+'"><div class="board-item-content"><span>' + codeToAdd + '</span></div></div>');
            }
        }
    }
}