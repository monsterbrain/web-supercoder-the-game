
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
                    if(muuri === item.getGrid()){
                        updateCorrectStatus(muuri, muuri._id);
                    }
                    muuri.refreshItems();
                });

                console.log('drag end');
                
            })
            .on('layoutStart', function () {
                boardGrid.refreshItems().layout();
            })
            .on('move', function () {
                console.log('moved');
                
            })
            ;

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

var htmlGridId = 1, cssGridId, jsGridId;
function updateCorrectStatus(grid, gridId){
    if(gridId == htmlGridId){
        // get order array
        var currentItems = grid.getItems();
        var currentItemIds = currentItems.map(function (item) {
            return item.getElement().getAttribute('data-id')
        });

        // update html items
        for (let i = 0; i < currentItems.length; i++) {
            $(currentItems[i].getElement()).find('div').removeClass('correct-code-line').removeClass('error-code-line');
            if(currentItemIds[i]==i){
                $(currentItems[i].getElement()).find('div').addClass('correct-code-line');
            } else {
                $(currentItems[i].getElement()).find('div').addClass('error-code-line');
            }
            
        }
        console.log(currentItemIds);
        
    }
}

function generateCodes(board) {
    //var arr= [1,2,3,4,5,6,7,8];
    
    const tab = '&nbsp; &nbsp; ';

    // var codeObjArray=[];
    // for (var i = 0; i < codes.length; i++) {
    //     var codeObj = [];
    //     for (var j = 0; j < codes[i].length; j++) {
    //         var newObj = {id:j, text: codes[i][j]};
    //         codeObj.push(newObj);
    //     }
    //     codeObjArray.push(codeObj);
    // }

    // arrays converted to objects
    codeObjArray = [
        // html
        [
            {id: 0, text: "<h1>"}, {id: 1, text: tab+"Title made with HTML"}, 
            {id: 2, text: "</h1>"}, {id: 3, text: "<hr>"}, {id: 4, text: "<p>"}, {id: 5, text: tab+"And I am Subtitle."}, 
            {id: 6, text: "</p>"}, {id: 7, text: "<button>"}, {id: 8, text: tab+"Hide the text above"}, 
            {id: 9, text: "</button>"}, {id: 10, text: "<h2>Click</h2>"}
        ], // css 
        [ // used to check the style sheets in order, detrmined by start and end
            {id: 0,  tag:'start', parentid:-1, text: "body {"},
            {id: 1,  tag:'style', parentid:0, text: "	text-align: center;"},
            {id: 2,  tag:'style', parentid:0, text: "	padding: 3rem;"},
            {id: 3,  tag:'end', parentid:-1, text: "}"},
            {id: 4,  tag:'start', parentid:-1, text: "h1, h2 {"},
            {id: 5,  tag:'style', parentid:4, text: "	font-size: 2rem;"},
            {id: 6,  tag:'end', parentid:-1, text: "}"},
            {id: 7,  tag:'start', parentid:-1, text: "p {"},
            {id: 8,  tag:'style', parentid:7, text: "	margin-bottom: 40px;"},
            {id: 9,  tag:'style', parentid:7, text: "	color: tomato;"},
            {id: 10, tag:'end', parentid:-1, text: "}"},
            {id: 11, tag:'start', parentid:-1, text: "button {"},
            {id: 12, tag:'style', parentid:11, text: "	padding: 0.75rem 2rem;"},
            {id: 13, tag:'end', parentid:-1, text: "}"}
        ], // js
        [
            {id: 0, text: "var clickFn = function (){"},
            {id: 1, text: "	$('p').css('opacity', 0);"},
            {id: 2, text: "};"},
            {id: 3, text: "$('button').click(clickFn);"}
        ]

    ];

    var jsOrderArray = [[0,1,2],[3]];

    // shuffle the codes
    shuffle(codeObjArray[0]);

    for (var i = 0; i < codeObjArray.length; i++) {
        var codeArray = codeObjArray[i];
        for (var j = 0; j < codeArray.length; j++) {
            var codeToAdd = codeArray[j];
            codeToAdd.text = codeToAdd.text.replace(/</g, '&lt;');
            codeToAdd.text = codeToAdd.text.replace(/>/g, '&gt;');

            var addClass = '';
            if (codeToAdd.text.indexOf('&lt;') != -1) {
                addClass += 'cm-tag'
            }

            var boardItem = $('<div class="board-item" data-id="'+codeToAdd.id+'"><div class="board-item-content"><span class="' + addClass + '">' + codeToAdd.text + '</span></div></div>');
            if (i == 0) {
                $('.todo>.board-column-content').append(boardItem);
            } else if (i == 1) {
                $('.working>.board-column-content').append(boardItem);
            } else if (i == 2) {
                $('.done>.board-column-content').append(boardItem);
            }
        }
    }
}

function shuffle(arr){
    for (let i = 0; i < arr.length-1; i++) {
        var rand = parseInt(Math.random()*(arr.length-(i+1))) + (i+1);
        var temp = arr[i]; arr[i] = arr[rand]; arr[rand] = temp;
    }
}

// loading the positions based on data-id

// function initRandomPositions(gridId, indexArray) {
//     console.log('gridId'+gridId);
//     console.log('indexArray'+indexArray);
//     shuffle(indexArray);

//     // referring this https://codepen.io/niklasramo/pen/YveqNN
//     var currentItems = columnGrids[gridId].getItems();
//     var currentItemIds = currentItems.map(function (item) {
//         return item.getElement().getAttribute('data-id')
//     });

//     var newItems = [];
//     var itemId;
//     var itemIndex;

//     for (var i = 0; i < indexArray.length; i++) {
//         itemId = indexArray[i];
//         itemIndex = currentItemIds.indexOf(itemId);
//         if (itemIndex > -1) {
//             newItems.push(currentItems[itemIndex])
//         }
//     }

//     columnGrids[gridId].sort(newItems, {layout: 'instant'});
// }