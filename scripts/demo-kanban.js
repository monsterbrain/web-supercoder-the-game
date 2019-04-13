
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
                    if (muuri === item.getGrid()) {
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

    cssGridId = columnGrids[1]._id;
    jsGridId = columnGrids[2]._id;

    //  var positioningItems = grid.getItems().filter(function (item) {
    //  return item.isPositioning();

});

var validHtml = false, validCss = false, validJs = false;

var htmlGridId = 1, cssGridId, jsGridId;
function updateCorrectStatus(grid, gridId) {
    if (gridId == htmlGridId) {
        // get order array
        var currentItems = grid.getItems();
        var currentItemIds = currentItems.map(function (item) {
            return item.getElement().getAttribute('data-id')
        });

        var isAllCorrect = true;

        // update html items
        for (let i = 0; i < currentItems.length; i++) {
            $(currentItems[i].getElement()).find('div').removeClass('correct-code-line').removeClass('error-code-line');
            if (currentItemIds[i] == i) {
                $(currentItems[i].getElement()).find('div').addClass('correct-code-line');
            } else {
                isAllCorrect = false;
                $(currentItems[i].getElement()).find('div').addClass('error-code-line');
            }
        }

        validHtml =  isAllCorrect;
        console.log(currentItemIds);

        checkForGameWon();
    }
    else if (gridId == cssGridId) {
        var currentItems = grid.getItems();
        var currentItemObjs = currentItems.map(function (item) {
            $(item.getElement()).find('div').removeClass('correct-code-line').removeClass('error-code-line');
            return {
                elem: item.getElement(),
                id: item.getElement().getAttribute('data-id'),
                tag: item.getElement().getAttribute('data-tag'),
                parentid: item.getElement().getAttribute('data-parentid'),
            }
        });

        var isAllCorrect = true;

        var parent, parentid = -1, numStylesAdded = 0;
        for (var i = 0, len = currentItemObjs.length; i < len; i++) {
            const obj = currentItemObjs[i];
            console.log({ obj });
            // 1. check if tag is parent
            if (parentid == -1) {
                if (obj.tag == 'start') {
                    parent = obj.elem;
                    $(obj.elem).find('div').addClass('correct-code-line');
                    parentid = obj.id; //set parent id
                    numStylesAdded = 0;
                } else if(obj.tag == 'style') {
                    isAllCorrect = false;
                    // style without parent - error
                    $(obj.elem).find('div').addClass('error-code-line');
                }
                else {
                    isAllCorrect = false;
                    // style without parent - error
                    $(obj.elem).find('div').addClass('error-code-line');
                }
            } else {
                // 2. parent tag is active. check for styles
                if (obj.tag == 'start') {
                    // another parent without closing the first one! wrong!!
                    isAllCorrect = false;
                    $(obj.elem).find('div').addClass('error-code-line');
                } else if (obj.tag == 'end') {
                    parentid = -1;
                    // end this parent, if some styles are added.
                    if (numStylesAdded == 0) {
                        isAllCorrect = false;
                        $(obj.elem).find('div').addClass('error-code-line'); // empty code block
                    } else {
                        $(obj.elem).find('div').addClass('correct-code-line');
                    }
                } else if (obj.tag == 'style') {
                    numStylesAdded += 1;
                    if (obj.parentid == parentid) {
                        $(obj.elem).find('div').addClass('correct-code-line');
                    } else {
                        isAllCorrect = false;
                        $(obj.elem).find('div').addClass('error-code-line');
                    }
                }
            }
        }

        validCss = isAllCorrect;
        checkForGameWon();        
    } else if(gridId == jsGridId){
        // get order array
        var currentItems = grid.getItems();
        
        var currentItemIds = currentItems.map(function (item) {
            $(item.getElement()).find('div').removeClass('correct-code-line').removeClass('error-code-line');
            return parseInt(item.getElement().getAttribute('data-id'))
        });

        var isAllCorrect = true;
        for (let i = 0; i < jsOrderArray.length; i++) {
            const orderArr = jsOrderArray[i];
            
            var startIndex = currentItemIds.indexOf(orderArr[0]); // first index of starting index is taken
            var isCorrectOrder = true; // in this case loop over [0, 1, 2]
            for (let j = 0; j < orderArr.length; j++) {
                const correctIndex = orderArr[j];
                if(currentItemIds[startIndex+j]==undefined || currentItemIds[startIndex+j] != orderArr[j]){
                    isCorrectOrder = false; break;
                }
            }

            if(isCorrectOrder){
                for (let j = 0; j < orderArr.length; j++)
                    if(currentItems[startIndex+j]!= undefined)
                        $(currentItems[startIndex+j].getElement()).find('div').addClass('correct-code-line');
            } else {
                isAllCorrect = false;
                for (let j = 0; j < orderArr.length; j++){
                    var index = currentItemIds.indexOf(orderArr[j]);
                    $(currentItems[index].getElement()).find('div').addClass('error-code-line');
                }
            }
        }

        validJs = isAllCorrect;
        checkForGameWon();
    }
}

function checkForGameWon() {
    if(validHtml && validCss && validJs){
        $('#game-win-div').removeClass('hide');
    }
}

var jsOrderArray;

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
            { id: 0, text: "<h1>" }, { id: 1, text: tab + "Title made with HTML" },
            { id: 2, text: "</h1>" }, { id: 3, text: "<hr>" }, { id: 4, text: "<p>" }, { id: 5, text: tab + "And I am Subtitle." },
            { id: 6, text: "</p>" }, { id: 7, text: "<button>" }, { id: 8, text: tab + "Hide the text above" },
            { id: 9, text: "</button>" }, { id: 10, text: "<h2>Click</h2>" }
        ], // css 
        [ // used to check the style sheets in order, detrmined by start and end
            { id: 0, tag: 'start', parentid: -1, text: "body {" },
            { id: 1, tag: 'style', parentid: 0, text: "	text-align: center;" },
            { id: 2, tag: 'style', parentid: 0, text: "	padding: 3rem;" },
            { id: 3, tag: 'end', parentid: -1, text: "}" },
            { id: 4, tag: 'start', parentid: -1, text: "h1, h2 {" },
            { id: 5, tag: 'style', parentid: 4, text: "	font-size: 2rem;" },
            { id: 6, tag: 'end', parentid: -1, text: "}" },
            { id: 7, tag: 'start', parentid: -1, text: "p {" },
            { id: 8, tag: 'style', parentid: 7, text: "	margin-bottom: 40px;" },
            { id: 9, tag: 'style', parentid: 7, text: "	color: tomato;" },
            { id: 10, tag: 'end', parentid: -1, text: "}" },
            { id: 11, tag: 'start', parentid: -1, text: "button {" },
            { id: 12, tag: 'style', parentid: 11, text: "	padding: 0.75rem 2rem;" },
            { id: 13, tag: 'end', parentid: -1, text: "}" }
        ], // js
        [
            { id: 0, text: "var clickFn = function (){" },
            { id: 1, text: "	$('p').css('opacity', 0);" },
            { id: 2, text: "};" },
            { id: 3, text: "$('button').click(clickFn);" }
        ]

    ];

    jsOrderArray = [[0, 1, 2], [3]];

    // shuffle the codes
    shuffle(codeObjArray[0]);
    shuffle(codeObjArray[1]);
    shuffle(codeObjArray[2]);

    for (var i = 0; i < codeObjArray.length; i++) {
        var codeArray = codeObjArray[i];
        for (var j = 0; j < codeArray.length; j++) {
            var codeToAdd = codeArray[j];
            var txtContent = codeToAdd.text;
            var addClass = '';

            if (i == 0) { //html
                txtContent = txtContent.replace(/</g, '&lt;');
                txtContent = txtContent.replace(/>/g, '&gt;');

                if (txtContent.indexOf('&lt;') != -1) {
                    addClass += 'cm-tag'
                }
            } else if (i == 1) { // css
                if(codeToAdd.tag == 'style')
                    txtContent = tab + txtContent;
            }

            var boardItem = $('<div class="board-item" data-id="' + codeToAdd.id + '"></div>');
            if (i == 1) { // for css
                boardItem.attr('data-tag', codeToAdd.tag);
                boardItem.attr('data-parentid', codeToAdd.parentid);
            }
            boardItem.append('<div class="board-item-content"><span class="' + addClass + '">' + txtContent + '</span></div>');

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

function shuffle(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        var rand = parseInt(Math.random() * (arr.length - (i + 1))) + (i + 1);
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