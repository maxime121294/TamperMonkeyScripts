// ==UserScript==
// @name         PR-Template
// @namespace    http://tampermonkey.net/
// @description  Add button on bitbucket PR Creation/Edit pages to insert the PR template in textarea
// @require http://code.jquery.com/jquery-latest.js
// @match        https://bitbucket.org/lvmh-maisons/*/pull-requests/new*
// @match        https://bitbucket.org/lvmh-maisons/*/pull-requests/update/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var cache = {
        textarea : document.getElementById('id_description')
    };

    function setSelRange(inputEl, selStart, selEnd) {
        if (inputEl.setSelectionRange) {
            inputEl.focus();
            inputEl.setSelectionRange(selStart, selEnd);
        } else if (inputEl.createTextRange) {
            var range = inputEl.createTextRange();
            range.collapse(true);
            range.moveEnd('character', selEnd);
            range.moveStart('character', selStart);
            range.select();
        }
    }
    // From http://www.webmasterworld.com/forum91/4527.htm

    function focusTextOn(str) {
        var pos = cache.textarea.value.indexOf(str);

        setSelRange(cache.textarea, pos, pos + str.length);
    }

    function growTextarea() {
        $('#id_description').css('height', '350px');
    }

    function selectDestinationBranch(branchName) {
        $('#id_target_group .branch-field-container .select2-chosen').html(branchName);
    }

    function removeStanFromReviewers() {
        var closeStan = $('img[src^="https://bitbucket.org/account/stormier"]:eq(0)').closest("li").find("a").get(0);
        if(closeStan !== undefined) {
            closeStan.click();
        }
    }

    function closeBranchAfterMerge() {
        $('#id_close_anchor_branch').click();
    }

    function insertPRCode() {
        var regex = /RE-[0-9]{1,5}/gm,
            branch = $('.select2-chosen')[0].innerHTML,
            regexMatch = branch.match(regex),
            jira = regexMatch !== null ? regexMatch[0] : "RE-";

        removeStanFromReviewers();
        //closeBranchAfterMerge();
        //selectDestinationBranch("develop");

        $('#id_title_group input').val(branch);

        cache.textarea.value =
            "***[JIRA]*** https://lvmh-maisons.atlassian.net/browse/" + jira + "\n" +
            "\n" +
            "***[IMPACT AREA]*** \n" +
            "\n" +
            "***[IMPACT RISK]*** \n" +
            "\n" +
            "***[PURPOSE]*** The purpose of this PR is to :\n" +
            "\n" +
            "* \n" +
            "\n" +
            "***[SCOPE]*** ";

        growTextarea();
    }

    function init(){
        var insertPR    = document.createElement('li'),
            optionsList = document.getElementsByClassName('markItUpHeader')[0].firstElementChild;

        insertPR.className = 'markItUpButton markdown separator first last right';
        insertPR.innerHTML = 'PR Template';
        optionsList.appendChild(insertPR);

        insertPR.addEventListener('click', insertPRCode);
    }

    init();
})();