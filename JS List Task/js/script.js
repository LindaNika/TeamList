function onItemInputFormSubmit() {
    var itemTitle = document.querySelector('.ItemInputField');
    if (itemTitle) {
        var valueOfElement = itemTitle.value;
        if (valueOfElement) {
            var num = increaseNumberOfItems();
            addItem(num, valueOfElement, true);
        }
    }
    itemTitle.value = "";
    showItems();
}

function increaseNumberOfItems() {
    var hasNumber = localStorage.hasOwnProperty('NumberOfItems');
    var num = 1;
    if (hasNumber) {
        num = localStorage.getItem('NumberOfItems');
        num = parseInt(num, 10) + 1;
    }
    localStorage.setItem('NumberOfItems', num);
    return num;
}

function getShowOption(showOption) {
    var hasUrl = window.location.hash;

    if (showOption == undefined) {
        if (hasUrl === '#/active') {
            showOption = 1;
        } else if (hasUrl === '#/completed') {
            showOption = 2;
        }
    }

    return showOption;
}

function getLiElement(listItem, index) {
    var checkedTxt = listItem.isActive ? "" : "checked";
    var liClass = listItem.isActive ? "ng-scope" : "ng-scope completed";

    var liElementHtml =
        "<li class='" + liClass + "' id='li_ele_" + index + "'>" +
        "<div class='view'>" +
        "<input class='toggle' type='checkbox' onchange='changeActiveItem(" + index + ");'id='ch_item_" + index + "' " + checkedTxt + ">" +
        "<label id='lb_title_" + index + "' ondblclick='editTodo(" + index + ");'>" + listItem.title + "</label>" +
        "<button class='destroy' onclick='deleteListItem(" + index + "); showItems();'></button>" +
        "</div>" +
        "<form onsubmit='saveEdits(" + index + ");' class='ng-pristine ng-valid'> " +
        "<input id='in_val_" + index + "' class='edit ng-pristine ng-valid ng-touched' onblur='saveEdits(" + index + ");' onkeydown='skipEdits(" + index + ");'>" +
        "</form>" +
        "</li>";

    return liElementHtml;
}

function showItems(showOption) {
    var listElement = document.querySelector('.MyListOfItems');
    var innerLiHtml = '';
    var numOfActiveItems = 0;

    showOption = getShowOption(showOption);

    var listOfItems = getListItems();

    for (var i = 0; i < listOfItems.length; i++) {
        var listItem = listOfItems[i];

        if (listItem.isActive) {
            numOfActiveItems++;
        }
        if (showOption == 1 && !listItem.isActive) {
            continue;
        }
        if (showOption == 2 && listItem.isActive) {
            continue;
        }

        var checkedTxt = listItem.isActive ? "" : "checked";
        var liClass = listItem.isActive ? "ng-scope" : "ng-scope completed";
        innerLiHtml = innerLiHtml + getLiElement(listItem, i + 1);
    }

    listElement.innerHTML = innerLiHtml;

    processFooterElement(listOfItems, numOfActiveItems);
    processCompletedElements(listOfItems.length - numOfActiveItems);
    processToggleAllElement(listOfItems, numOfActiveItems);
}

function processToggleAllElement(listOfItems, numOfActiveItems) {
    var toggleAllElement = document.getElementById('toggle-all');

    if (listOfItems.length < 1) {
        toggleAllElement.className = toggleAllElement.className + 'hidden';
    } else {
        var oldClassNames = toggleAllElement.className;
        toggleAllElement.className = oldClassNames.replace("hidden", "");

        var numOfCompleted = listOfItems.length - numOfActiveItems;
        if (numOfActiveItems > 0) {
            toggleAllElement.checked = false;
        } else {
            toggleAllElement.checked = true;
        }
    }
}

function processFooterElement(listOfItems, numOfActiveItems) {
    var section = document.getElementById('footer');

    if (listOfItems.length > 0) {
        section.className = '';
        var itemsLeftElement = document.getElementById('todo-count');
        if (numOfActiveItems == 1) {
            itemsLeftElement.innerHTML = "<strong>1 item left</strong>"
        } else {
            itemsLeftElement.innerHTML = "<strong>" + numOfActiveItems + " items left</strong>"
        }
    } else {
        section.className = 'hidden';
    }
}

function processCompletedElements(num) {
    var clearCompletedElement = document.getElementById('clear-completed');

    if ((num) > 0) {
        clearCompletedElement.className = '';
    } else {
        clearCompletedElement.className = 'hidden';
    }

}

function skipEdits(index) {
    var evt = window.event;
    if (evt.keyCode == 27) {
        var liElement = document.getElementById('li_ele_' + index);
        liElement.classList.remove('editing');
        var labelElement = document.getElementById('lb_title_' + index);
        var titleValue = labelElement.childNodes[0].textContent;
        var inputField = document.getElementById('in_val_' + index);
        inputField.value = titleValue;
    }
}

function editTodo(index) {
    var liElement = document.getElementById('li_ele_' + index);
    liElement.classList.add('editing');
    var labelElement = document.getElementById('lb_title_' + index);
    var titleValue = labelElement.childNodes[0].textContent;
    var inputField = document.getElementById('in_val_' + index);
    inputField.focus();
    inputField.value = titleValue;
}

function saveEdits(index) {
    var liElement = document.getElementById('li_ele_' + index);

    var inputField = document.getElementById('in_val_' + index);
    var newVal = inputField.value;
    if (newVal) {
        localStorage.setItem('MyItemTitle' + index, newVal);
        var labelElement = document.getElementById('lb_title_' + index);
        labelElement.childNodes[0].textContent = newVal;
        liElement.classList.remove('editing');
    } else {
        deleteListItem(index);
        showItems();
    }
}

function getListItems() {
    var listItems = [];
    var numOfItems = +localStorage.getItem('NumberOfItems');

    for (var i = 1; i <= numOfItems; i++) {
        listItems.push(getListItem(i));
    }
    return listItems;
}


function getListItem(index) {
    var listItem = {};
    var itemTitle = localStorage.getItem('MyItemTitle' + index);
    var isActive = localStorage.getItem('MyItemActive' + index);
    listItem.title = itemTitle;
    listItem.isActive = isTrue(isActive);
    return listItem;
}

function isTrue(value) {
    if (value === 'true') {
        return true;
    }
    return false;
}


function addItem(index, title, isActive) {
    localStorage.setItem('MyItemTitle' + index, title);
    localStorage.setItem('MyItemActive' + index, isActive);
}

function removeItem(index) {
    localStorage.removeItem('MyItemTitle' + index);
    localStorage.removeItem('MyItemActive' + index);
}

function changeActiveItem(index) {
    var chElement = document.getElementById('ch_item_' + index);
    if (chElement.checked) {
        localStorage.setItem('MyItemActive' + index, false);
    } else {
        localStorage.setItem('MyItemActive' + index, true);
    }
    showItems();
}

function deleteListItem(index) {
    var numOfItems = localStorage.getItem('NumberOfItems');
    for (var i = 1; i <= numOfItems; i++) {
        if (i < index) {
            continue;
        }
        if (i == index) {
            removeItem(i);
        }
        if (i > index) {
            var listItem = getListItem(i);
            removeItem(i);
            addItem((i - 1), listItem.title, listItem.isActive);
        }
    }

    localStorage.setItem('NumberOfItems', (numOfItems - 1));
}

function clearCompletedTodos() {
    var numOfItems = localStorage.getItem('NumberOfItems');
    for (var i = 1; i <= numOfItems; i++) {
        var isActiveValue = localStorage.getItem('MyItemActive' + i);
        var isActive = isTrue(isActiveValue);

        if (!isActive) {
            deleteListItem(i);
        }
    }
}

function markAll() {
    var toggleAllElement = document.getElementById('toggle-all');
    var isChecked = toggleAllElement.checked;

    var numOfItems = localStorage.getItem('NumberOfItems');
    for (var i = 1; i <= numOfItems; i++) {
        localStorage.setItem('MyItemActive' + i, !isChecked);
    }
}

