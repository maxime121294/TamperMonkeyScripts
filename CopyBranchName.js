// ==UserScript==
// @name         CopyBranchName
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add a special link to copy the slugify branch name in the clipboard
// @require      http://code.jquery.com/jquery-latest.js
// @author       Maxime REBIBO and Esteban RIOS
// @match        https://lvmh-maisons.atlassian.net/browse/RE-*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var prefix = 'feature/';
    var issueId = $('.issue-link').text();
    var title = $('h1#summary-val').text();

    var finalBranchName = prefix + issueId + '-' + string_to_slug(title);

    function string_to_slug(str) {
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
        var to   = "aaaaeeeeiiiioooouuuunc------";
        for (var i=0, l=from.length ; i<l ; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    }

    /**
    * Create the new Plugin section
    */
    function createPluginSection() {
        const agileSection = $('#greenhopper-agile-issue-web-panel');
        const pluginSection = '<div id="pluginSection" class="module toggle-wrap"><div class="mod-header"><h2 class="toggle-title">Super plugin</h2></div><div class="mod-content"><ul class="item-details"></ul></div></div>';
        agileSection.after(pluginSection);
    }

    /**
    * Append all plugin links in the Plugin section
    */
    function appendPluginLinks() {
        const pluginList = $('#pluginSection ul');
        pluginList.append('<li><a href="#" id="copyBranchName">Copy slugified branch name</a></li>');
    }

    /**
    * Launch all the event listeners
    */
    function initializeEvents() {
        $('#copyBranchName').on('click', function(e) {
            e.preventDefault();
            var copyText = document.getElementById("finalBranchName");
            copyText.select();
            document.execCommand("Copy");
        });
    }

    /**
    * Launches everything
    */
    function init() {
        createPluginSection();
        appendPluginLinks();

        $('body').append('<input id="finalBranchName" type="text" value="' + finalBranchName + '" />');

        initializeEvents();
    }

    init();
})();